const Request = require('../../../../../../../src/adapters/sensor-system/sensor/send_signal/controller/Request');
const RequestInterface = require('../../../../../../../src/application/sensor/send_signal/Request');
const Signal = require('../../../../../../../src/domain/signal/Signal');

test('implements interface', () => {
    expect(new Request('value')).toBeInstanceOf(RequestInterface);
});

test('provides fqcn', () => {
    expect(Request.toString()).toBe('SensorSystem.SensorSystem.Sensor.SendSignal.Controller.Request');
});

test('exposes properties', () => {
    const value = 'value';
    const request = new Request(value);

    expect(request.getSignal()).toStrictEqual(new Signal(value));
});
