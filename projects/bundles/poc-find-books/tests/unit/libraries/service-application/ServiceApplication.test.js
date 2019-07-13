const ServiceApplication = require('../../../../src/libraries/service-application/ServiceApplication');
const ConnectionListener = require('../../../../src/libraries/service-application/server/ConnectionListener');
const ServerFactory = require('../../../../src/libraries/service-application/server/ServerFactory');
const ApplicationWidgetFactory = require('../../../../src/libraries/service-application/ApplicationWidgetFactory');
const Server = require('../../../../src/libraries/service-application/server/Server');
const ApplicationWidget = require('../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ServiceApplicationException = require('../../../../src/libraries/service-application/ServiceApplicationException');
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|ServerFactory}
 */
const serverFactory = {};

/**
 * @type {Object|ApplicationWidgetFactory}
 */
const applicationWidgetFactory = {};

/**
 * @type {null|ServiceApplication}
 */
let application = null;

/**
 * @type {Object|Server}
 */
const server = {};

/**
 * @type {Object|ApplicationWidget}
 */
const app = {};

beforeEach(() => {
    applicationWidgetFactory.create = () => app;
    app.connect = jest.fn();

    application = new ServiceApplication(serverFactory, applicationWidgetFactory);

    serverFactory.create = listener => listener === application ? server : null;
    server.listen = jest.fn(() => application.listen({}));
});

test('implements interface', () => {
    expect(application).toBeInstanceOf(ConnectionListener);
});

test('can be injected', () => {
    expect(ServiceApplication.__DEPS__).toStrictEqual([ ServerFactory, ApplicationWidgetFactory ]);
});

test('provides fqcn', () => {
    expect(ServiceApplication.toString()).toBe('FindBooks.ServiceApplication.ServiceApplication');
    expect(ServiceApplicationException.toString()).toBe('FindBooks.ServiceApplication.ServiceApplicationException');
});

test('starts server when run', () => {
    const host = 'host';
    const port = 1234;

    application.run(host, port);

    expect(server.listen.mock.calls[0][0]).toBe(host);
    expect(server.listen.mock.calls[0][1]).toBe(port);
});

test('connects a different application at every connection', () => {
    let bus1 = null;
    const app1 = { connect: jest.fn() };
    const connection1 = 'connection1';
    let bus2 = null;
    const app2 = { connect: jest.fn() };
    const connection2 = 'connection2';
    let call = 0;

    server.listen = () => {
        application.listen(connection1);
        application.listen(connection2);
    };
    applicationWidgetFactory.create = jest.fn((bus, connection) => {
        if (call++) {
            bus2 = bus;
            return app2;
        }
        bus1 = bus;
        return app1;
    });

    application.run('host', 1234);

    expect(applicationWidgetFactory.create.mock.calls[0][0]).toBeInstanceOf(MessageBus);
    expect(applicationWidgetFactory.create.mock.calls[0][1]).toBe(connection1);
    expect(applicationWidgetFactory.create.mock.calls[1][0]).toBeInstanceOf(MessageBus);
    expect(applicationWidgetFactory.create.mock.calls[1][1]).toBe(connection2);
    expect(app1.connect).toBeCalled();
    expect(app2.connect).toBeCalled();
    expect(bus1).not.toBe(bus2);
});
