const AdapterDependencies = require('../../../src/run_program/AdapterDependencies');
const Presenter = require('../../../src/run_program/Presenter');
const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const ProgramLoader = require('app/program-loader').ProgramLoader;
const System = require('app/system').System;
const Notifier = require('app/notifications').Notifier;

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
 * @type {Object|Notifier}
 */
const notifier = {};

/**
 * @type {null|AdapterDependencies}
 */
let adapter = null;

beforeEach(() => {
    adapter = new AdapterDependencies(presenter, architectureLoader, programLoader, system, notifier);
});

test('can be injected', () => {
    expect(AdapterDependencies.__DEPS__).toStrictEqual([Presenter, ArchitectureLoader, ProgramLoader, System, Notifier]);
});

test('provides fqcn', () => {
    expect(AdapterDependencies.toString()).toBe('SlothMachine.VirtualMachine.RunProgram.AdapterDependencies');
});

test('provides dependencies', () => {
    expect(adapter.getPresenter()).toBe(presenter);
    expect(adapter.getArchitectureLoader()).toBe(architectureLoader);
    expect(adapter.getProgramLoader()).toBe(programLoader);
    expect(adapter.getSystem()).toBe(system);
    expect(adapter.getNotifier()).toBe(notifier);
});
