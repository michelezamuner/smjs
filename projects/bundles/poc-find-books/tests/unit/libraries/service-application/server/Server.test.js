const Server = require('../../../../../src/libraries/service-application/server/Server');
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const ConnectionListener = require('../../../../../src/libraries/service-application/server/ConnectionListener');
const ServerFactory = require('../../../../../src/libraries/service-application/server/ServerFactory');

test('provides fqcn', () => {
    expect(Server.toString()).toBe('FindBooks.ServiceApplication.Server.Server');
    expect(Connection.toString()).toBe('FindBooks.ServiceApplication.Server.Connection');
    expect(ConnectionListener.toString()).toBe('FindBooks.ServiceApplication.Server.ConnectionListener');
    expect(ServerFactory.toString()).toBe('FindBooks.ServiceApplication.Server.ServerFactory');
});
