const FileActuator = require('../../../../src/adapters/file-actuator/FileActuator');
const Actuator = require('../../../../src/application/actuator/Actuator');
const Writer = require('../../../../src/adapters/file-actuator/Writer');
const Signal = require('../../../../src/domain/signal/Signal');
const NativeWriter = require('../../../../src/adapters/file-actuator/NativeWriter');

/**
 * @type {Object|Writer}
 */
const writer = {};

/**
 * @type {string}
 */
const outputFile = 'file';

/**
 * @type {null|FileActuator}
 */
let actuator = null;

beforeEach(() => {
    writer.write = jest.fn();
    actuator = new FileActuator(writer, outputFile);
});

test('implements interface', () => {
    expect(actuator).toBeInstanceOf(Actuator);
});

test('can be injected', () => {
    expect(FileActuator.__DEPS__).toStrictEqual([ Writer, 'file_actuator.output_file' ]);
});

test('provides fqcn', () => {
    expect(FileActuator.toString()).toBe('SensorSystem.FileActuator.FileActuator');
    expect(NativeWriter.toString()).toBe('SensorSystem.FileActuator.NativeWriter');
    expect(Writer.toString()).toBe('SensorSystem.FileActuator.Writer');
});

test('writes signal value to file', () => {
    const value = 'value';
    const signal = new Signal(value);

    actuator.activate(signal);

    expect(writer.write.mock.calls[0][0]).toBe(outputFile);
    expect(writer.write.mock.calls[0][1]).toBe(value);
});
