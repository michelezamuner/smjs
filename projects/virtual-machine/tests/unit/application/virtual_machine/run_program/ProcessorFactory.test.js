const ProcessorFactory = require('../../../../../src/application/virtual_machine/run_program/ProcessorFactory');
const Processor = require('domain/sloth-machine-framework').processor.Processor;

test('creates processors', () => {
    const factory = new ProcessorFactory();
    const interpreter = {};

    expect(factory.create(interpreter)).toStrictEqual(new Processor(interpreter));
});
