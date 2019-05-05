const Application = require('../../../../../src/libraries/service-application/application/Application');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/application/ApplicationWidgetDeps');
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
 * @type {Object|ApplicationWidgetDeps}
 */
const deps = {};

/**
 * @type {null|Application}
 */
let application = null;

/**
 * @type {Object|Connection}
 */
const connection = {};

/**
 * @type {Object|InputParser}
 */
const parser = {};

/**
 * @type {Object[]}
 */
const widgets = [
    {name: 'w1', widget: {connect: jest.fn()}},
    {name: 'w2', widget: {connect: jest.fn()}},
];

beforeEach(() => {
    bus.callbacks = {};
    bus.register = (types, callback) => bus.callbacks[types[0]] = callback;
    bus.send = jest.fn(msg => {
        if (!bus.callbacks[msg.constructor]) {
            return;
        }
        bus.callbacks[msg.constructor](msg)
    });
    deps.getBus = () => bus;
    deps.getConnection = () => connection;
    deps.getParser = () => parser;
    connection.end = jest.fn();
    connection.write = jest.fn();
    connection.on = () => {};

    application = new Application(deps);
    widgets.forEach(w => application.addWidget(w.name, w.widget));
});

test('extends widget', () => {
    expect(application).toBeInstanceOf(Widget);
});

test('provides fqcn', () => {
    expect(Application.toString()).toBe('FindBooks.ServiceApplication.Application.Application');
    expect(SendResponse.toString()).toBe('FindBooks.ServiceApplication.Messages.SendResponse');
    expect(SendData.toString()).toBe('FindBooks.ServiceApplication.Messages.SendData');
    expect(RequestReceived.toString()).toBe('FindBooks.ServiceApplication.Messages.RequestReceived');
    expect(ApplicationWidgetDeps.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationWidgetDeps');
});

test('calls parent connect', () => {
    application.connect();

    widgets.forEach(w => expect(w.widget.connect).toBeCalled());
});

test('handles ending connection on response', () => {
    const response = 'response';

    application.connect();
    bus.send(new SendResponse(response));

    expect(connection.end.mock.calls[0][0]).toBe(response);
});

test('handles sending data', () => {
    const data = 'data';

    application.connect();
    bus.send(new SendData(data));

    expect(connection.write.mock.calls[0][0]).toBe(data);
});

test('handles data input', () => {
    const input = 'input';
    const request = {};

    connection.on = (event, callback) => { callback(input); }
    parser.parse = arg => arg === input ? request : null;

    application.connect();

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new RequestReceived(request));
});
