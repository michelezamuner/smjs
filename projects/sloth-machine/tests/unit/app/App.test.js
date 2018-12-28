const App = require('../../../src/app/App');
const Parser = require('parser').CommandLineParser;
const Container = require('container').Container;
const RunProgramController = require('../../../src/adapters/cli/vm/run_program/Controller');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {Object|Parser}
 */
const parser = {};

/**
 * @type {null|App}
 */
let app = null;

beforeEach(() => {
    app = new App(container, parser);
});

test('fails if unsupported architecture is selected', () => {
    const architecture = 'unsupported';
    const controller = {};

    parser.getArgument = name => name === 'arc' ? architecture : null;
    controller.run = request => {
        if (request.getArchitecture() === architecture) {
            throw new UnsupportedArchitectureException(architecture);
        }
    };
    container.make = type => type === RunProgramController ? controller : null;

    expect(() => app.run()).toThrow(new Error(`Unsupported architecture "${architecture}"`));
});

test.skip('fails if no program file is passed', () => {
    // @todo: implement this
});

test.skip('fails if invalid program file is passed', () => {
    // @todo: implement this
});

test.skip('delegate to adapter', () => {
    // @todo: implement this
});
