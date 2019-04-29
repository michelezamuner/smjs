const ServerFactory = require('../../../../../src/libraries/service-application/server/ServerFactory');
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const ConnectionListener = require('../../../../../src/libraries/service-application/server/ConnectionListener');
const Server = require('../../../../../src/libraries/service-application/server/Server');

test('can be injected', () => {
    expect(ServerFactory.__DEPS__).toStrictEqual([ ConnectionListener ] );
});

test('provides fqcn', () => {
    expect(ServerFactory.toString()).toBe('FindBooks.ServiceApplication.Server.ServerFactory');
    expect(Connection.toString()).toBe('FindBooks.ServiceApplication.Server.Connection');
    expect(Server.toString()).toBe('FindBooks.ServiceApplication.Server.Server');
});

test('creates server wrapper', () => {
    const listener = {};
    const factory = new ServerFactory(listener);
    const server = factory.create();

    expect(server).toBeInstanceOf(Server);
});
