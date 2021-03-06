const LocalArchitectureLoader = require('../../src/LocalArchitectureLoader');
const ArchitectureLoader = require('app/architecture-loader').ArchitectureLoader;
const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;
const UnsupportedArchitectureException = require('app/architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('app/architecture-loader').InvalidArchitectureException;
const ModuleLoader = require('../../src/ModuleLoader');
const CannotFindModuleException = require('../../src/CannotFindModuleException');
const NativeModuleLoader = require('../../src/NativeModuleLoader');

/**
 * @type {Object|ModuleLoader}
 */
const moduleLoader = {};

/**
 * @type {string}
 */
const architecturesDirectory = 'directory';

/**
 * @type {null|LocalArchitectureLoader}
 */
let loader = null;

/**
 * @type {string}
 */
const architectureName = 'architecture';

/**
 * @type {string}
 */
const architectureModule = architecturesDirectory + '/' + architectureName + '/lib';

beforeEach(() => {
    loader = new LocalArchitectureLoader(moduleLoader, architecturesDirectory);
});

test('implements architecture loader', () => {
    expect(loader).toBeInstanceOf(ArchitectureLoader);
});

test('can be injected', () => {
    expect(LocalArchitectureLoader.__DEPS__).toStrictEqual([
        ModuleLoader,
        'adapters.local_architecture_loader.path',
    ]);
});

test('provides fqcn', () => {
    expect(CannotFindModuleException.toString()).toBe('SlothMachine.LocalArchitectureLoader.CannotFindModuleException');
    expect(LocalArchitectureLoader.toString()).toBe('SlothMachine.LocalArchitectureLoader.LocalArchitectureLoader');
    expect(ModuleLoader.toString()).toBe('SlothMachine.LocalArchitectureLoader.ModuleLoader');
    expect(NativeModuleLoader.toString()).toBe('SlothMachine.LocalArchitectureLoader.NativeModuleLoader');
});

test('loads requested architecture', () => {
    const ArchitectureClass = class extends Architecture {};
    const architecture = new ArchitectureClass();
    moduleLoader.load = module => module === architectureModule ? architecture : null;

    expect(loader.load(architectureName)).toStrictEqual(architecture);
});

test('fails if requested architecture cannot be found', () => {
    moduleLoader.load = module => {
        if (module === architectureModule) {
            throw new CannotFindModuleException();
        }
    };

    expect.assertions(2);
    try {
        loader.load(architectureName);
    } catch (e) {
        expect(e).toBeInstanceOf(UnsupportedArchitectureException);
        expect(e.getArchitectureName()).toBe(architectureName);
    }
});

test('forwards generic exception of module loader', () => {
    const GenericException = class extends Error {};
    const genericException = 'generic exception';
    moduleLoader.load = module => {
        if (module === architectureModule) {
            throw new GenericException(genericException);
        }
    };
    expect(() => loader.load(architectureName)).toThrow(GenericException);
    expect(() => loader.load(architectureName)).toThrow(genericException);
});

test('fails if loaded module is not an architecture', () => {
    const architecture = 'not a real architecture';
    moduleLoader.load = module => module === architectureModule ? architecture : null;

    expect.assertions(2);
    try {
        loader.load(architectureName);
    } catch (e) {
        expect(e).toBeInstanceOf(InvalidArchitectureException);
        expect(e.getArchitectureName()).toBe(architectureName);
    }
});
