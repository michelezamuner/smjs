const LocalArchitectureLoader = require('../../../../src/adapters/local_architecture_loader/LocalArchitectureLoader');
const ArchitectureLoader = require('architecture-loader').ArchitectureLoader;
const Architecture = require('sloth-machine-framework').Architecture;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const ModuleLoader = require('../../../../src/adapters/local_architecture_loader/ModuleLoader');
const ModuleLoaderException = require('../../../../src/adapters/local_architecture_loader/ModuleLoaderException');

/**
 * @type {Object}
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

test('loads requested architecture', () => {
    const ArchitectureClass = class extends Architecture {};
    const architecture = new ArchitectureClass();
    moduleLoader.load = module => module === architectureModule ? architecture : null;

    expect(loader.load(architectureName)).toStrictEqual(architecture);
});

test('wraps module loader exception', () => {
    moduleLoader.load = module => {
        if (module === architectureModule) {
            throw new ModuleLoaderException();
        }
    };

    let thrown = false;
    try {
        loader.load(architectureName);
    } catch (e) {
        thrown = true;
        expect(e).toBeInstanceOf(UnsupportedArchitectureException);
        expect(e.getArchitectureName()).toBe(architectureName);
    }
    expect(thrown).toBe(true);
});

test('wraps generic exception of module loader', () => {
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

    let thrown = false;
    try {
        loader.load(architectureName);
    } catch (e) {
        thrown = true;
        expect(e).toBeInstanceOf(InvalidArchitectureException);
        expect(e.getArchitectureName()).toBe(architectureName);
    }
    expect(thrown).toBe(true);
});
