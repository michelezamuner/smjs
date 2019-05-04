const Application = require('../../../../../src/libraries/service-application/application/Application');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const SendData = require('../../../../../src/libraries/service-application/messages/SendData');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const UI = require('../../../../../src/libraries/service-application/application/UI');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|UI}
 */
const ui = {};

/**
 * @type {Object|InputParser}
 */
const parser = {};

/**
 * @type {null|Application}
 */
let application = null;

/**
 * @type {Object|Connection}
 */
const connection = {};

/**
 * @type {Object[]}
 */
const widgets = [
    {connect: jest.fn()},
    {connect: jest.fn()},
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
    ui.getWidgets = () => widgets;
    connection.end = jest.fn();
    connection.write = jest.fn();
    connection.on = () => {};

    application = new Application(bus, ui, parser);
});

test('provides fqcn', () => {
    expect(Application.toString()).toBe('FindBooks.ServiceApplication.Application.Application');
    expect(SendResponse.toString()).toBe('FindBooks.ServiceApplication.Messages.SendResponse');
    expect(SendData.toString()).toBe('FindBooks.ServiceApplication.Messages.SendData');
    expect(RequestReceived.toString()).toBe('FindBooks.ServiceApplication.Messages.RequestReceived');
    expect(UI.toString()).toBe('FindBooks.ServiceApplication.Application.UI');
});

test('connects all children widgets as well', () => {
    application.connect(connection);

    for (const widget of widgets) {
        expect(widget.connect).toBeCalled();
    }

    expect.assertions(widgets.length);
});

test('handles ending connection on response', () => {
    const response = 'response';

    application.connect(connection);
    bus.send(new SendResponse(response));

    expect(connection.end.mock.calls[0][0]).toBe(response);
});

test('handles sending data', () => {
    const data = 'data';

    application.connect(connection);
    bus.send(new SendData(data));

    expect(connection.write.mock.calls[0][0]).toBe(data);
});

test('handles data input', () => {
    const input = 'input';
    const request = {};

    connection.on = (event, callback) => { callback(input); }
    parser.parse = arg => arg === input ? request : null;

    application.connect(connection);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new RequestReceived(request));
});
