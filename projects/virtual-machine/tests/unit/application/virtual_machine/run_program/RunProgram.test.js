const RunProgram = require('../../../../../src/application/virtual_machine/run_program/RunProgram');
const MissingProgramReferenceException = require('../../../../../src/application/virtual_machine/run_program/MissingProgramReferenceException');
const ProcessorFactory = require('../../../../../src/application/virtual_machine/run_program/ProcessorFactory');
const AdapterDependencies = require('../../../../../src/application/virtual_machine/run_program/AdapterDependencies');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const ProcessorException = require('sloth-machine-framework').ProcessorException;
const Response = require('../../../../../src/application/virtual_machine/run_program/Response');

/**
 * @type {Object|ProcessorFactory}
 */
const processorFactory = {};

/**
 * @type {Object|AdapterDependencies}
 */
const adapter = {};

/**
 * @type {null|RunProgram}
 */
let service = null;

/**
 * @type {Object}
 */
const presenter = {};

/**
 * @type {Object}
 */
const architectureLoader = {};

/**
 * @type {Object}
 */
const programLoader = {};

/**
 * @type {Object}
 */
const system = {};

/**
 * @type {Object}
 */
const interpreter = {};

/**
 * @type {Object}
 */
const processor = {};

/**
 * @type {Object}
 */
const architecture = {};

/**
 * @type {Object}
 */
const program = {};

/**
 * @type {Object}
 */
const exitStatus = {};

/**
 * @type {string}
 */
const architectureName = 'architecture';

/**
 * @type {string}
 */
const programReference = 'program';

/**
 * @type {Object}
 */
const request = {};

beforeEach(() => {
    processorFactory.create = int => int === interpreter ? processor : null;
    adapter.getPresenter = () => presenter;
    adapter.getArchitectureLoader = () => architectureLoader;
    adapter.getProgramLoader = () => programLoader;
    adapter.getSystem = () => system;
    presenter.present = jest.fn();
    architectureLoader.load = name => name === architectureName ? architecture : null;
    architecture.getInterpreter = sys => sys === system ? interpreter : null;
    programLoader.load = ref => ref === programReference ? program : null;
    processor.run = prog => prog === program ? exitStatus : null;
    request.getArchitectureName = () => architectureName;
    request.getProgramReference = () => programReference;

    service = new RunProgram(adapter, processorFactory);
});

test('can be injected', () => {
    expect(RunProgram.__DEPS__).toStrictEqual([AdapterDependencies, ProcessorFactory]);
});

test('runs loaded program with loaded architecture and sends proper response to given presenter', () => {
    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(exitStatus));
});

test('handles missing program reference', () => {
    const error = new MissingProgramReferenceException();
    request.getProgramReference = () => null;

    service.run(request);

    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles unsupported architecture exceptions', () => {
    const error = new UnsupportedArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles invalid architecture exceptions', () => {
    const error = new InvalidArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles invalid program exceptions', () => {
    const error = new InvalidProgramException();
    programLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles unsupported architecture exceptions', () => {
    const error = new ProcessorException();
    processor.run = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('forwards generic exceptions', () => {
    const error = 'error';
    processor.run = () => {
        throw new Error('error');
    };

    expect(() => service.run(request)).toThrow(Error);
    expect(() => service.run(request)).toThrow(error);
});
