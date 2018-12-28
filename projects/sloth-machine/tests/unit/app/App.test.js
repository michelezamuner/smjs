const App = require('../../../src/app/App');
const Container = require('../../../src/app/Container');
const AppConfig = require('../../../src/app/AppConfig');
const RunProgramController = require('../../../src/adapters/cli/vm/run_program/Controller');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {null|App}
 */
let app = null;

beforeEach(() => {
    app = new App(container);
});

test('fails if unsupported architecture is selected', () => {
    const architecture = 'unsupported';
    const config = new AppConfig(architecture, '');
    const controller = {};

    controller.run = request => {
        if (request.getArchitecture() === architecture) {
            throw new UnsupportedArchitectureException(architecture);
        }
    };
    container.make = type => type === RunProgramController ? controller : null;

    expect(() => app.run(config)).toThrow(new Error(`Unsupported architecture "${architecture}"`));
});

test.skip('fails if invalid program file is passed', () => {
    // @todo: implement this
});

test.skip('delegate to adapter', () => {
    // @todo: implement this
});
