const ServiceApplication = require('../../../../src/libraries/service-application/ServiceApplication');
const ConnectionListener = require('../../../../src/libraries/service-application/server/ConnectionListener');
const ServerFactory = require('../../../../src/libraries/service-application/server/ServerFactory');
const ApplicationFactory = require('../../../../src/libraries/service-application/ApplicationFactory');
const Server = require('../../../../src/libraries/service-application/server/Server');
const ApplicationWidget = require('../../../../src/libraries/service-application/widgets/ApplicationWidget');
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|ServerFactory}
 */
const serverFactory = {};

/**
 * @type {Object|ServiceApplicationFactory}
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
 * @type {Object|ApplicationWidget}
 */
const app = {};

beforeEach(() => {
    applicationFactory.create = () => app;
    app.connect = jest.fn();

    application = new ServiceApplication(serverFactory, applicationFactory);

    serverFactory.create = listener => listener === application ? server : null;
    server.listen = jest.fn(() => application.listen({}));
});

test('implements interface', () => {
    expect(application).toBeInstanceOf(ConnectionListener);
});

test('can be injected', () => {
    expect(ServiceApplication.__DEPS__).toStrictEqual([ ServerFactory, ApplicationFactory ]);
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

test('connects a different application at every connection', () => {
    let bus1 = null;
    const app1 = { connect: jest.fn() };
    const connection1 = 'connection1';

    let bus2 = null;
    const app2 = { connect: jest.fn() };
    const connection2 = 'connection2';

    server.listen = () => {
        application.listen(connection1);
        application.listen(connection2);
    };
    applicationFactory.create = jest.fn((bus, connection) => {
        if (connection === connection1) {
            bus2 = bus;
            return app2;
        }
        bus1 = bus;
        return app1;
    });

    application.run('host', 1234);

    expect(applicationFactory.create.mock.calls[0][1]).toBe(connection1);
    expect(applicationFactory.create.mock.calls[1][1]).toBe(connection2);
    expect(app1.connect).toBeCalled();
    expect(app2.connect).toBeCalled();
    expect(bus1).toBeInstanceOf(MessageBus);
    expect(bus2).toBeInstanceOf(MessageBus);
    expect(bus1).not.toBe(bus2);
});
