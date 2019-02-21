const AdapterDependencies = require('../../../../../src/application/virtual_machine/run_program/AdapterDependencies');
const Presenter = require('../../../../../src/application/virtual_machine/run_program/Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('architecture-loader').System;

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
 * @type {null|AdapterDependencies}
 */
let adapter = null;

beforeEach(() => {
    adapter = new AdapterDependencies(presenter, architectureLoader, programLoader, system);
});

test('can be injected', () => {
    expect(AdapterDependencies.__DEPS__).toStrictEqual([Presenter, ArchitectureLoader, ProgramLoader, System]);
});

test('provides dependencies', () => {
    expect(adapter.getPresenter()).toBe(presenter);
    expect(adapter.getArchitectureLoader()).toBe(architectureLoader);
    expect(adapter.getProgramLoader()).toBe(programLoader);
    expect(adapter.getSystem()).toBe(system);
});
