const App = require('../../../src/app/App');
const Parser = require('parser').CommandLineParser;
const Container = require('container').Container;
const Provider = require('../../../src/app/Provider');
const RunProgramController = require('../../../src/adapters/cli/vm/run_program/Controller');
const Request = require('../../../src/adapters/cli/vm/run_program/Request');
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const AppException = require('../../../src/app/AppException');

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {Object|Provider}
 */
const provider = {};

/**
 * @type {Object|Parser}
 */
const parser = {};

/**
 * @type {Object|RunProgramController}
 */
const controller = {};

/**
 * @type {null|App}
 */
let app = null;

beforeEach(() => {
    container.make = type => type === RunProgramController ? controller : null;
    provider.register = jest.fn();
    app = new App(container, provider, parser);
});

test('forwards execution to controller', () => {
    const architecture = 'architecture';
    const expectedRequest = new Request(architecture);

    controller.runProgram = jest.fn();
    parser.getArgument = name => name === 'arc' ? architecture : null;

    app.run();

    expect(provider.register.mock.calls[0][0]).toStrictEqual(container);
    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('wraps unsupported architecture exception', () => {
    const architecture = 'unsupported';

    parser.getArgument = name => name === 'arc' ? architecture : null;
    controller.runProgram = request => {
        if (request.getArchitecture() === architecture) {
            throw new UnsupportedArchitectureException(architecture);
        }
    };

    expect(() => app.run()).toThrow(new AppException(`Unsupported architecture "${architecture}"`));
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
