const SendSignal = require('../../../../../src/application/sensor/send_signal/SendSignal');
const Actuator = require('../../../../../src/application/actuator/Actuator');
const MessageBus = require('../../../../../src/application/message-bus/MessageBus');
const Signal = require('../../../../../src/domain/signal/Signal');
const ActuatorActivated = require('../../../../../src/application/sensor/send_signal/messages/ActuatorActivated');

/**
 * @type {Object|Actuator}
 */
const actuator = {};

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|SendSignal}
 */
let service = null;

beforeEach(() => {
    actuator.activate = jest.fn();
    bus.send = jest.fn();
    service = new SendSignal(actuator, bus);
});

test('can be injected', () => {
    expect(SendSignal.__DEPS__).toStrictEqual([ Actuator, MessageBus ]);
});

test('activates actuator after receiving sensor signal', () => {
    const signal = new Signal('value');
    const request = { getSignal: () => signal };

    service.send(request);

    expect(actuator.activate.mock.calls[0][0]).toStrictEqual(signal);
});

test('sends message after actuator is activated', () => {
    const signal = new Signal('value');
    const request = { getSignal: () => signal };

    service.send(request);

    expect(bus.send.mock.calls[0][0]).toStrictEqual(new ActuatorActivated(signal));
});
