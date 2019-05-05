const Application = require('../../../../../src/libraries/service-application/application/Application');
const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('../../../../../src/libraries/service-application/application/ApplicationWidgetDeps');
const ApplicationWidgetFactory = require('../../../../../src/libraries/service-application/application/ApplicationWidgetFactory');
const InputParser = require('../../../../../src/libraries/service-application/input-parser/InputParser');
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const SendResponse = require('../../../../../src/libraries/service-application/messages/SendResponse');
const SendData = require('../../../../../src/libraries/service-application/messages/SendData');
const RequestReceived = require('../../../../../src/libraries/service-application/messages/RequestReceived');
const StandardWidget = require('../../../../../src/libraries/service-application/widgets/StandardWidget');
const WidgetDeps = require('../../../../../src/libraries/service-application/widgets/WidgetDeps');

class StubWidget extends StandardWidget {
    /**
     * @param {WidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
        this._params = deps.getParams();
        this._isConnected = false;
    }

    /**
     * @override
     */
    connect() {
        this._isConnected = true;
    }

    /**
     * @return {boolean}
     */
    isConnected() {
        return this._isConnected;
    }

    /**
     * @return {MessageBus}
     */
    getBus() {
        return this._bus;
    }

    /**
     * @return {Application}
     */
    getApp() {
        return this._app;
    }

    /**
     * @return {Object}
     */
    getParams() {
        return this._params;
    }
}

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
    {name: 'w1', type: StubWidget, params: {}},
    {name: 'w2', type: StubWidget, params: {}},
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
    widgets.forEach(w => application.addWidget(w.name, w.type, w.params));
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
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.Application.ApplicationWidgetFactory');
});

test('adds widget with self as app', () => {
    const params = {};

    application.addWidget('name1', StubWidget, params);
    application.addWidget('name2', StubWidget);

    const widget1 = application.getWidget('name1');
    expect(widget1).toBeInstanceOf(StubWidget);
    expect(widget1.getBus()).toBe(bus);
    expect(widget1.getApp()).toBe(application);
    expect(widget1.getParams()).toBe(params);

    const widget2 = application.getWidget('name2');
    expect(widget2.getParams()).toStrictEqual({});
});

test('calls parent connect', () => {
    application.connect();

    widgets.forEach(w => expect(application.getWidget(w.name).isConnected()).toBe(true));
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
