const ServiceApplication = require('../../../../src/libraries/service-application/ServiceApplication');
const ConnectionListener = require('../../../../src/libraries/service-application/server/ConnectionListener');
const ServerFactory = require('../../../../src/libraries/service-application/server/ServerFactory');
const ApplicationFactory = require('../../../../src/libraries/service-application/application/ApplicationFactory');
const Server = require('../../../../src/libraries/service-application/server/Server');

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
    applicationFactory.create = jest.fn(() => app);
    app.addWidget = jest.fn();
    app.connect = jest.fn();

    application = new ServiceApplication(serverFactory, applicationFactory);

    serverFactory.create = listener => listener === application ? server : null;
    server.listen = jest.fn();
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

test('connects different application at every connection', () => {
    const app1 = { connect: jest.fn(), addWidget: () => {} };
    const connection1 = 'connection1';
    const app2 = { connect: jest.fn(), addWidget: () => {} };
    const connection2 = 'connection2';
    let call = 0;

    server.listen = () => {
        application.listen(connection1);
        application.listen(connection2);
    };
    applicationFactory.create = jest.fn(() => call++ ? app2 : app1);
    
    application.run('host', 1234);

    expect(applicationFactory.create.mock.calls[0][1]).toBe(connection1);
    expect(applicationFactory.create.mock.calls[1][1]).toBe(connection2);
    expect(app1.connect).toBeCalled();
    expect(app2.connect).toBeCalled();
});

test('adds registered widgets to application on connection', () => {
    const widgets = [
        {name: 'w1', type: 'type1', args: ['arg11', 'arg12']},
        {name: 'w2', type: 'type2', args: ['arg21']},
        {name: 'w3', type: 'type1', args: []},
    ];
    const connection = {};

    server.listen = () => application.listen(connection);
    for (const widget of widgets) {
        application.addWidget(widget.name, widget.type, ...widget.args);
    }

    application.run('host', 1234);

    expect(applicationFactory.create.mock.calls[0][0]).toStrictEqual(widgets);
    expect(applicationFactory.create.mock.calls[0][1]).toStrictEqual(connection);
});
