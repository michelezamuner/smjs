const Controller = require('../../../../../../../src/adapters/sensor-system/sensor/send_signal/controller/Controller');
const SendSignal = require('../../../../../../../src/application/sensor/send_signal/SendSignal');
const Request = require('../../../../../../../src/adapters/sensor-system/sensor/send_signal/controller/Request');

/**
 * @type {Object|SendSignal}
 */
const service = {};

/**
 * @type {null|Controller}
 */
let controller = null;

beforeEach(() => {
    service.send = jest.fn();
    controller = new Controller(service);
});

test('can be injected', () => {
    expect(Controller.__DEPS__).toStrictEqual([ SendSignal ]);
});

test('provides fqcn', () => {
    expect(Controller.toString()).toBe('SensorSystem.SensorSystem.Sensor.SendSignal.Controller.Controller');
});

test('activates actuator', () => {
    const value = 'value';

    controller.sendSignal(value);

    expect(service.send.mock.calls[0][0]).toStrictEqual(new Request(value));
});
