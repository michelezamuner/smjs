const RunProgram = require('../../../src/run_program/RunProgram');
const MissingProgramReferenceException = require('../../../src/run_program/MissingProgramReferenceException');
const ProcessorFactory = require('../../../src/run_program/ProcessorFactory');
const AdapterDependencies = require('../../../src/run_program/AdapterDependencies');
const UnsupportedArchitectureException = require('app/architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('app/architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('app/program-loader').InvalidProgramException;
const ProcessorException = require('domain/sloth-machine-framework').processor.ProcessorException;
const Response = require('../../../src/run_program/Response');
const ArchitectureLoaded = require('../../../src/run_program/messages/ArchitectureLoaded');
const ProgramLoaded = require('../../../src/run_program/messages/ProgramLoaded');
const ExecutionTerminated = require('../../../src/run_program/messages/ExecutionTerminated');
const ApplicationFailed = require('../../../src/run_program/messages/ApplicationFailed');
const Request = require('../../../src/run_program/Request');
const Presenter = require('../../../src/run_program/Presenter');

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
const notifier = {};

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

/**
 * @type {null|boolean}
 */
let presenterCalled = null;

beforeEach(() => {
    presenterCalled = false;
    processorFactory.create = int => int === interpreter ? processor : null;
    adapter.getPresenter = () => presenter;
    adapter.getArchitectureLoader = () => architectureLoader;
    adapter.getProgramLoader = () => programLoader;
    adapter.getSystem = () => system;
    adapter.getNotifier = () => notifier;
    presenter.present = jest.fn(() => presenterCalled = true);
    notifier.notify = jest.fn(() => expect(presenterCalled).toBe(false));
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

test('provides fqcn', () => {
    expect(RunProgram.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.RunProgram');
    expect(MissingProgramReferenceException.toString())
        .toBe('SlothMachine.VirtualMachine.RunProgram.MissingProgramReferenceException');
    expect(Presenter.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Presenter');
    expect(Request.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Request');
    expect(Response.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Response');
    expect(ApplicationFailed.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Messages.ApplicationFailed');
    expect(ArchitectureLoaded.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Messages.ArchitectureLoaded');
    expect(ExecutionTerminated.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Messages.ExecutionTerminated');
    expect(ProgramLoaded.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.Messages.ProgramLoaded');
});

test('runs loaded program with loaded architecture and sends proper response to given presenter', () => {
    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(exitStatus));
});

test('sends proper application messages', () => {
    service.run(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ArchitectureLoaded(architecture, architectureName));
    expect(notifier.notify.mock.calls[1][0]).toStrictEqual(new ProgramLoaded(program, programReference));
    expect(notifier.notify.mock.calls[2][0]).toStrictEqual(new ExecutionTerminated(exitStatus));
});

test('handles missing program reference', () => {
    request.getProgramReference = () => null;

    service.run(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ApplicationFailed(new MissingProgramReferenceException()))
    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, new MissingProgramReferenceException()));
});

test('handles unsupported architecture exceptions', () => {
    const error = new UnsupportedArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ApplicationFailed(error));
    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles invalid architecture exceptions', () => {
    const error = new InvalidArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(notifier.notify.mock.calls[0][0]).toStrictEqual(new ApplicationFailed(error));
    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles invalid program exceptions', () => {
    const error = new InvalidProgramException();
    programLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(notifier.notify.mock.calls[1][0]).toStrictEqual(new ApplicationFailed(error));
    expect(presenter.present).toBeCalledTimes(1);
    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new Response(null, error));
});

test('handles processor exceptions', () => {
    const error = new ProcessorException();
    processor.run = () => {
        throw error;
    };

    service.run(request);

    expect(notifier.notify.mock.calls[2][0]).toStrictEqual(new ApplicationFailed(error));
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
