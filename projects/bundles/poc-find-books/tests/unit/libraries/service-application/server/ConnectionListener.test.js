const ConnectionListener = require('../../../../../src/libraries/service-application/server/ConnectionListener');
const Connection = require('../../../../../src/libraries/service-application/server/Connection');
const MessageBus = require('message-bus').MessageBus;
const ConnectionEstablished = require('../../../../../src/libraries/service-application/messages/ConnectionEstablished');

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|ConnectionListener}
 */
let listener = null;

/**
 * @type {Object|Connection}
 */
const connection = {};

beforeEach(() => {
    bus.send = jest.fn();
    listener = new ConnectionListener(bus);
});

test('can be injected', () => {
    expect(ConnectionListener.__DEPS__).toStrictEqual([ MessageBus ]);
});

test('provides fqcn', () => {
    expect(ConnectionListener.toString()).toBe('FindBooks.ServiceApplication.Server.ConnectionListener');
});

test('sends connection established event', () => {
    listener.listen(connection);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new ConnectionEstablished(connection));
});
