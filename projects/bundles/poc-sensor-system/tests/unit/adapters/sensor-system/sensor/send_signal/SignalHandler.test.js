const SignalHandler = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/SignalHandler');
const NativeServerHandler = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/NativeServerHandler');
const Router = require('router').Router;
const Request = require('router').Request;

/**
 * @type {Object|Router}
 */
const router = {};

/**
 * @type {null|SignalHandler}
 */
let handler = null;

/**
 * @type {string}
 */
const signal = 'signal';

class StubClient {
    on(event, callback) {
        if (event !== 'data') {
            return;
        }
        callback(signal);
    }
}

beforeEach(() => {
    router.route = jest.fn();
    handler = new SignalHandler(router);
});

test('implements native handler', () => {
    expect(handler).toBeInstanceOf(NativeServerHandler);
});

test('can be injected', () => {
    expect(SignalHandler.__DEPS__).toStrictEqual([ Router ]);
});

test('provides fqcn', () => {
    expect(SignalHandler.toString()).toBe('SensorSystem.SensorSystem.Sensor.SendSignal.SignalHandler');
    expect(NativeServerHandler.toString()).toBe('SensorSystem.SensorSystem.Sensor.SendSignal.NativeServerHandler');
});

test('routes client signal', () => {
    const request = new Request('sensor-system/send_signal', { signal: signal });

    handler.handle(new StubClient());

    expect(router.route.mock.calls[0][0]).toStrictEqual(request);
});
