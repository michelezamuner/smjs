const Application = require('../../../../../src/libraries/service-application/application/Application');
const MessageBusFactory = require('../../../../../src/libraries/service-application/application/MessageBusFactory');
const WidgetFactory = require('../../../../../src/libraries/service-application/application/WidgetFactory');
const ApplicationFactory = require('../../../../../src/libraries/service-application/application/ApplicationFactory');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const SendData = require('../../../../../src/libraries/service-application/messages/SendData');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');

/**
 * @type {Object|MessageBusFactory}
 */
const busFactory = {};

/**
 * @type {Object|WidgetFactory}
 */
const widgetFactory = {};

/**
 * @type {Object|InputParser}
 */
const parser = {};

/**
 * @type {null|Application}
 */
let application = null;

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|Connection}
 */
const connection = {};

beforeEach(() => {
    busFactory.create = () => bus;
    bus.callbacks = {};
    bus.register = (types, callback) => bus.callbacks[types[0]] = callback;
    bus.send = jest.fn(msg => {
        if (!bus.callbacks[msg.constructor]) {
            return;
        }
        bus.callbacks[msg.constructor](msg)
    });
    connection.end = jest.fn();
    connection.write = jest.fn();
    connection.on = () => {};

    application = new Application(busFactory, widgetFactory, parser);
});

test('can be injected', () => {
    expect(Application.__DEPS__).toStrictEqual([ MessageBusFactory, WidgetFactory, InputParser]);
});

test('provides fqcn', () => {
    expect(Application.toString()).toBe('FindBooks.ServiceApplication.Application.Application');
    expect(MessageBusFactory.toString()).toBe('FindBooks.ServiceApplication.Application.MessageBusFactory');
    expect(WidgetFactory.toString()).toBe('FindBooks.ServiceApplication.Application.WidgetFactory');
    expect(ApplicationFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationFactory');
    expect(SendResponse.toString()).toBe('FindBooks.ServiceApplication.Messages.SendResponse');
    expect(SendData.toString()).toBe('FindBooks.ServiceApplication.Messages.SendData');
    expect(RequestReceived.toString()).toBe('FindBooks.ServiceApplication.Messages.RequestReceived');
});

test('creates widgets with own bus', () => {
    const type = 'type';
    const arg1 = 'arg1';
    const arg2 = 'arg2';
    const widgetName = 'widget';
    const widget = {};

    widgetFactory.create = (typeArg, busArg, args) => {
        if (typeArg !== type || busArg !== bus || args[0] !== arg1 || args[1] !== arg2) {
            return null;
        }

        return widget;
    };

    application.addWidget(widgetName, type, [arg1, arg2]);

    expect(application.getWidget(widgetName)).toBe(widget);
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
