const LocalArchitectureLoader = require('../../../../../src/adapters/cli/architecture/LocalArchitectureLoader');
const ModuleLoader = require('../../../../../src/adapters/cli/architecture/ModuleLoader');
const ModuleLoaderException = require('../../../../../src/adapters/cli/architecture/ModuleLoaderException');
const ProgramLoader = require('core').ProgramLoader;
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

/**
 * @type {Object}
 */
const moduleLoader = {};

/**
 * @type {Object}
 */
const programLoader = {};

/**
 * @type {string}
 */
const architecturesDirectory = 'directory';

/**
 * @type {null|LocalArchitectureLoader}
 */
let loader = null;

beforeEach(() => {
    moduleLoader.load = jest.fn();
    loader = new LocalArchitectureLoader(moduleLoader, programLoader, architecturesDirectory);
});

test('can be injected', () => {
    expect(LocalArchitectureLoader.__DEPS__).toStrictEqual([
        ModuleLoader,
        ProgramLoader,
        'adapters.cli.architecture.architectures_directory',
    ]);
});

test('loads requested architecture', () => {
    const architectureName = 'architecture';
    const architecture = 'architecture object';
    const architectureModule = architecturesDirectory + '/' + architectureName + '/lib';
    const architectureFactory = { create: loader => loader === programLoader ? architecture : null };

    moduleLoader.load = module => module === architectureModule ? architectureFactory : null;

    expect(loader.load(architectureName)).toStrictEqual(architecture);
});

test('wraps module loader exception', () => {
    const architectureName = 'architecture';
    const architectureModule = architecturesDirectory + '/' + architectureName + '/lib';

    moduleLoader.load = module => {
        if (module === architectureModule) {
            throw new ModuleLoaderException();
        }
    };

    expect(() => loader.load(architectureName)).toThrow(new UnsupportedArchitectureException(architectureName));
});
