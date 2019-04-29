const ServiceApplication = require('../../../../src/libraries/service-application/ServiceApplication');
const MessageBus = require('message-bus').MessageBus;
const ServerFactory = require('../../../../src/libraries/service-application/server/ServerFactory');
const ApplicationFactory = require('../../../../src/libraries/service-application/application/ApplicationFactory');
const Server = require('../../../../src/libraries/service-application/server/Server');
const ConnectionEstablished = require('../../../../src/libraries/service-application/messages/ConnectionEstablished');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {Object|ServerFactory}
 */
const serverFactory = {};

/**
 * @type {Object|ApplicationFactory}
 */
const applicationFactory = {};

/**
 * @type {null|ServiceApplication}
 */
let application = null;

/**
 * @type {Object|Server}
 */
const server = {};

/**
 * @type {Object|Application}
 */
const app = {};

beforeEach(() => {
    bus.register = (types, callback) => {
        if (types[0] !== ConnectionEstablished) {
            return null;
        }
        bus.callback = callback;
    };
    bus.send = msg => bus.callback(msg);
    serverFactory.create = () => server;
    applicationFactory.create = () => app;
    server.listen = jest.fn();
    app.addWidget = jest.fn();
    app.connect = jest.fn();

    application = new ServiceApplication(bus, serverFactory, applicationFactory);
});

test('can be injected', () => {
    expect(ServiceApplication.__DEPS__).toStrictEqual([ MessageBus, ServerFactory, ApplicationFactory ]);
    expect(ConnectionEstablished.toString()).toBe('FindBooks.ServiceApplication.Messages.ConnectionEstablished');
});

test('provides fqcn', () => {
    expect(ServiceApplication.toString()).toBe('FindBooks.ServiceApplication.ServiceApplication');
});

test('starts server when run', () => {
    const host = 'host';
    const port = 1234;

    application.run(host, port);

    expect(server.listen.mock.calls[0][0]).toBe(host);
    expect(server.listen.mock.calls[0][1]).toBe(port);
});

test('connects different application at every connection', () => {
    const app1 = { connect: jest.fn(), addWidget: () => {} };
    const connection1 = 'connection1';
    const app2 = { connect: jest.fn(), addWidget: () => {} };
    const connection2 = 'connection2';
    let call = 0;

    applicationFactory.create = () => {
        if (call === 0) {
            call = 1;
            return app1;
        }

        return app2;
    };
    application.run('host', 1234);

    bus.send(new ConnectionEstablished(connection1));
    bus.send(new ConnectionEstablished(connection2));

    expect(app1.connect.mock.calls[0][0]).toBe(connection1);
    expect(app2.connect.mock.calls[0][0]).toBe(connection2);
});

test('adds registered widgets to application on connection', () => {
    const widgets = [
        {name: 'w1', type: 'type1', args: ['arg11', 'arg12']},
        {name: 'w2', type: 'type2', args: ['arg21']},
        {name: 'w3', type: 'type1', args: []},
    ];

    for (const widget of widgets) {
        application.addWidget(widget.name, widget.type, ...widget.args);
    }

    application.run('host', 1234);
    bus.send(new ConnectionEstablished(''));

    expect(app.addWidget.mock.calls[0][0]).toBe(widgets[0].name);
    expect(app.addWidget.mock.calls[0][1]).toBe(widgets[0].type);
    expect(app.addWidget.mock.calls[0][2]).toStrictEqual(widgets[0].args);
    expect(app.addWidget.mock.calls[1][0]).toBe(widgets[1].name);
    expect(app.addWidget.mock.calls[1][1]).toBe(widgets[1].type);
    expect(app.addWidget.mock.calls[1][2]).toStrictEqual(widgets[1].args);
    expect(app.addWidget.mock.calls[2][0]).toBe(widgets[2].name);
    expect(app.addWidget.mock.calls[2][1]).toBe(widgets[2].type);
    expect(app.addWidget.mock.calls[2][2]).toStrictEqual(widgets[2].args);
});
