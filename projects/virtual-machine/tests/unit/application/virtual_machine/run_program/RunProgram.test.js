const RunProgram = require('../../../../../src/application/virtual_machine/run_program/RunProgram');
const MissingProgramReferenceException = require('../../../../../src/application/virtual_machine/run_program/MissingProgramReferenceException');
const ProcessorFactory = require('../../../../../src/application/virtual_machine/run_program/ProcessorFactory');
const Presenter = require('../../../../../src/application/virtual_machine/run_program/Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const ProgramLoader = require('program-loader').ProgramLoader;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const ProcessorException = require('sloth-machine-framework').ProcessorException;
const System = require('architecture-loader').System;
const SuccessResponse = require('../../../../../src/application/virtual_machine/run_program/SuccessResponse');
const ErrorResponse = require('../../../../../src/application/virtual_machine/run_program/ErrorResponse');

/**
 * @type {Object|ProcessorFactory}
 */
const processorFactory = {};

/**
 * @type {Object|Presenter}
 */
const presenter = {};

/**
 * @type {Object|ArchitectureLoader}
 */
const architectureLoader = {};

/**
 * @type {Object|ProgramLoader}
 */
const programLoader = {};

/**
 * @type {Object|System}
 */
const system = {};

/**
 * @type {null|RunProgram}
 */
let service = null;

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
    presenter.present = jest.fn();
    architectureLoader.load = name => name === architectureName ? architecture : null;
    architecture.getInterpreter = sys => sys === system ? interpreter : null;
    programLoader.load = ref => ref === programReference ? program : null;
    processor.run = prog => prog === program ? exitStatus : null;
    request.getArchitectureName = () => architectureName;
    request.getProgramReference = () => programReference;

    service = new RunProgram(processorFactory, presenter, architectureLoader, programLoader, system);
});

test('can be injected', () => {
    expect(RunProgram.__DEPS__).toStrictEqual([ProcessorFactory, Presenter, ArchitectureLoader, ProgramLoader, System]);
});

test('runs loaded program with loaded architecture and sends proper response to given presenter', () => {
    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new SuccessResponse(exitStatus));
});

test('handles missing program reference', () => {
    request.getProgramReference = () => null;

    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new ErrorResponse(new MissingProgramReferenceException()));
});

test('handles unsupported architecture exceptions', () => {
    const error = new UnsupportedArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new ErrorResponse(error));
});

test('handles invalid architecture exceptions', () => {
    const error = new InvalidArchitectureException();
    architectureLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new ErrorResponse(error));
});

test('handles invalid program exceptions', () => {
    const error = new InvalidProgramException();
    programLoader.load = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new ErrorResponse(error));
});

test('handles unsupported architecture exceptions', () => {
    const error = new ProcessorException();
    processor.run = () => {
        throw error;
    };

    service.run(request);

    expect(presenter.present.mock.calls[0][0]).toStrictEqual(new ErrorResponse(error));
});
