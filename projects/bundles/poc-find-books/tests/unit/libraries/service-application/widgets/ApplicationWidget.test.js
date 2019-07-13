const ApplicationWidget = require('../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const SendData = require('../../../../../src/libraries/service-application/messages/SendData');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|Connection}
 */
const connection = {};

/**
 * @type {Object|InputParser}
 */
const parser = {};

/**
 * @type {ApplicationWidget}
 */
let application = null;

/**
 * @type {Object[]}
 */
const children = [
    { name: 'child1', widget: { connect: jest.fn() } },
    { name: 'child2', widget: { connect: jest.fn() } },
];

beforeEach(() => {
    bus.callbacks = {};
    bus.register = (types, callback) => bus.callbacks[types[0]] = callback;
    bus.send = jest.fn(msg => bus.callbacks[msg.constructor] && bus.callbacks[msg.constructor](msg));
    connection.end = jest.fn();
    connection.write = jest.fn();
    connection.on = () => {};

    application = new ApplicationWidget(bus, connection, parser);
    children.forEach(child => application.addWidget(child.name, child.widget));
});

test('extends widget', () => {
    expect(application).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(ApplicationWidget.toString()).toBe('FindBooks.ServiceApplication.Widgets.ApplicationWidget');
    expect(SendResponse.toString()).toBe('FindBooks.ServiceApplication.Messages.SendResponse');
    expect(SendData.toString()).toBe('FindBooks.ServiceApplication.Messages.SendData');
    expect(RequestReceived.toString()).toBe('FindBooks.ServiceApplication.Messages.RequestReceived');
});

test('calls parent connect', () => {
    application.connect();

    children.forEach(child => expect(child.widget.connect).toBeCalled());
});

test('handles ending connection on response', () => {
    const response = {};

    application.connect();
    bus.send(new SendResponse(response));

    expect(connection.end.mock.calls[0][0]).toBe(response);
});

test('handles sending data', () => {
    const data = {};

    application.connect();
    bus.send(new SendData(data));

    expect(connection.write.mock.calls[0][0]).toBe(data);
});

test('handles data input', () => {
    const data = '';
    const request = {};

    connection.on = (event, callback) => { callback(data); }
    parser.parse = arg => arg === data ? request : null;

    application.connect();

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new RequestReceived(request));
});