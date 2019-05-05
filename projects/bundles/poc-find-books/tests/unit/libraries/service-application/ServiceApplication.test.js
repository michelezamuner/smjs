const ServiceApplication = require('../../../../src/libraries/service-application/ServiceApplication');
const ConnectionListener = require('../../../../src/libraries/service-application/server/ConnectionListener');
const ServerFactory = require('../../../../src/libraries/service-application/server/ServerFactory');
const ApplicationWidgetFactory = require('../../../../src/libraries/service-application/ApplicationWidgetFactory');
const Server = require('../../../../src/libraries/service-application/server/Server');
const ApplicationWidget = require('../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ServiceApplicationException = require('../../../../src/libraries/service-application/ServiceApplicationException');

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
    applicationWidgetFactory.create = jest.fn(() => app);
    app.addWidget = jest.fn();
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
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.ApplicationWidgetFactory');
    expect(ServiceApplicationException.toString()).toBe('FindBooks.ServiceApplication.ServiceApplicationException');
});

test('starts server when run', () => {
    const host = 'host';
    const port = 1234;

    application.run(host, port);

    expect(server.listen.mock.calls[0][0]).toBe(host);
    expect(server.listen.mock.calls[0][1]).toBe(port);
});

test('uses default application widget class', () => {
    application.run('host', 1234);

    expect(applicationWidgetFactory.create.mock.calls[0][0]).toBe(ApplicationWidget);
});

test('overrides application widget class', () => {
    class StubApplication extends ApplicationWidget {}

    application.setApplicationWidgetClass(StubApplication);
    application.run('host', 1234);

    expect(applicationWidgetFactory.create.mock.calls[0][0]).toBe(StubApplication);
});

test('connects a different application at every connection', () => {
    const app1 = { connect: jest.fn(), addWidget: () => {} };
    const connection1 = 'connection1';
    const app2 = { connect: jest.fn(), addWidget: () => {} };
    const connection2 = 'connection2';
    let call = 0;

    server.listen = () => {
        application.listen(connection1);
        application.listen(connection2);
    };
    applicationWidgetFactory.create = jest.fn(() => call++ ? app2 : app1);

    application.run('host', 1234);

    expect(applicationWidgetFactory.create.mock.calls[0][2]).toBe(connection1);
    expect(applicationWidgetFactory.create.mock.calls[1][2]).toBe(connection2);
    expect(app1.connect).toBeCalled();
    expect(app2.connect).toBeCalled();
});

test('adds registered widgets to application on connection', () => {
    const widgets = [
        {name: 'w1', type: 'type1', params: {}},
        {name: 'w2', type: 'type2', params: {}},
        {name: 'w3', type: 'type1', params: {}},
    ];


    for (const widget of widgets) {
        application.addWidget(widget.name, widget.type, widget.params);
    }

    application.run('host', 1234);

    expect(applicationWidgetFactory.create.mock.calls[0][1]).toStrictEqual(widgets);
});
