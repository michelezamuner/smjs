const BusNotifier = require('../../../../src/adapters/bus-notifications/BusNotifier');
const Notifier = require('../../../../src/application/notifications/Notifier');
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {BusNotifier}
 */
let notifier = null;

beforeEach(() => {
    bus.send = jest.fn();
    notifier = new BusNotifier(bus);
});

test('implements interface', () => {
    expect(notifier).toBeInstanceOf(Notifier);
});

test('can be injected', () => {
    expect(BusNotifier.__DEPS__).toStrictEqual([ MessageBus ]);
});

test('sends notification through message bus', () => {
    const message = 'message';

    notifier.notify(message);

    expect(bus.send.mock.calls[0][0]).toBe(message);
});
