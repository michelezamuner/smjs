const AdapterDependencies = require('../../../../../src/application/virtual_machine/run_program/AdapterDependencies');
const Presenter = require('../../../../../src/application/virtual_machine/run_program/Presenter');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const ProgramLoader = require('program-loader').ProgramLoader;
const System = require('architecture-loader').System;
const MessageBus = require('message-bus').MessageBus;

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
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|AdapterDependencies}
 */
let adapter = null;

beforeEach(() => {
    adapter = new AdapterDependencies(presenter, architectureLoader, programLoader, system, bus);
});

test('can be injected', () => {
    expect(AdapterDependencies.__DEPS__).toStrictEqual([Presenter, ArchitectureLoader, ProgramLoader, System, MessageBus]);
});

test('provides dependencies', () => {
    expect(adapter.getPresenter()).toBe(presenter);
    expect(adapter.getArchitectureLoader()).toBe(architectureLoader);
    expect(adapter.getProgramLoader()).toBe(programLoader);
    expect(adapter.getSystem()).toBe(system);
    expect(adapter.getMessageBus()).toBe(bus);
});
