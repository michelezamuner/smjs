const SignalHandler = require('../../../../../../src/adapters/sensor-system/sensor/send_signal/SignalHandler');
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

beforeEach(() => {
    router.route = jest.fn();
    handler = new SignalHandler(router);
});

test('can be injected', () => {
    expect(SignalHandler.__DEPS__).toStrictEqual([ Router ]);
});

test('routes client signal', () => {
    const signal = 'signal';
    const request = new Request('sensor-system/send_signal', { signal: signal });

    handler.handleData(signal);

    expect(router.route.mock.calls[0][0]).toStrictEqual(request);
});
