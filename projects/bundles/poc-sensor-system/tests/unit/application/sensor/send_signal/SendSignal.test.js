const SendSignal = require('../../../../../src/application/sensor/send_signal/SendSignal');
const Actuator = require('../../../../../src/application/actuator/Actuator');
const Notifier = require('../../../../../src/application/notifications/Notifier');
const Signal = require('../../../../../src/domain/signal/Signal');
const ActuatorActivated = require('../../../../../src/application/sensor/send_signal/messages/ActuatorActivated');

/**
 * @type {Object|Actuator}
 */
const actuator = {};

/**
 * @type {Object|Notifier}
 */
const notifier = {};

/**
 * @type {null|SendSignal}
 */
let service = null;

beforeEach(() => {
    actuator.activate = jest.fn();
    notifier.notify = jest.fn();
    service = new SendSignal(actuator, notifier);
});

test('can be injected', () => {
    expect(SendSignal.__DEPS__).toStrictEqual([ Actuator, Notifier ]);
});

test('activates actuator after receiving sensor signal', () => {
    const signal = new Signal('value');
    const request = { getSignal: () => signal };

    service.send(request);

    expect(actuator.activate.mock.calls[0][0]).toStrictEqual(signal);
});

test('sends notification after actuator is activated', () => {
    const signal = new Signal('value');
    const request = { getSignal: () => signal };

    service.send(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ActuatorActivated(signal));
});
