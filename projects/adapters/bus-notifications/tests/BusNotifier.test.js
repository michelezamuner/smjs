const BusNotifier = require('../src/BusNotifier');
const Notifier = require('app/notifications').Notifier;
const MessageBus = require('message-bus').MessageBus;

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|BusNotifier}
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

test('delegates to bus', () => {
    const message = 'message';

    notifier.notify(message);

    expect(bus.send.mock.calls[0][0]).toBe(message);
});
