const RunProgram = require('../../../../../src/application/virtual_machine/run_program/RunProgram');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('architecture-loader').System;

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
 * @type {null|RunProgram}
 */
let service = null;

/**
 * @type {Object}
 */
const architecture = {};

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
    programLoader.load = jest.fn();
    architectureLoader.load = name => name === architectureName ? architecture : null;
    service = new RunProgram(architectureLoader, programLoader, system);
    request.getArchitectureName = () => architectureName;
    request.getProgramReference = () => programReference;
    architecture.getInterpreter = jest.fn();
});

test('can be injected', () => {
    expect(RunProgram.__DEPS__).toStrictEqual([ArchitectureLoader, ProgramLoader, System]);
});

test('loads requested interpreter from architecture', () => {
    service.run(request);

    expect(architecture.getInterpreter.mock.calls[0][0]).toBe(system);
});

test('loads requested program', () => {
    service.run(request);

    expect(programLoader.load.mock.calls[0][0]).toStrictEqual(programReference);
});
