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
 * @type {string}
 */
const parsedArchitecture = 'architecture';

/**
 * @type {string}
 */
const parsedFile = 'file';

/**
 * @type {null|App}
 */
let app = null;

beforeEach(() => {
    container.make = type => type === RunProgramController ? controller : null;
    container.bind = jest.fn();
    provider.register = jest.fn();
    parser.getArgument = name => {
        if (name === App.CLI_ARG_ARCHITECTURE) {
            return parsedArchitecture;
        }
        if (name === undefined) {
            return parsedFile;
        }
        return null;
    };
    controller.runProgram = jest.fn();
    app = new App(container, provider, parser);
});

test('binds given program file', () => {
    app.run();

    expect(container.bind.mock.calls[0][0]).toStrictEqual('app.file');
    expect(container.bind.mock.calls[0][1]).toStrictEqual(parsedFile);
});

test('forwards execution to controller', () => {
    const expectedRequest = new Request(parsedArchitecture);

    app.run();

    expect(provider.register.mock.calls[0][0]).toStrictEqual(container);
    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('uses default architecture', () => {
    const expectedRequest = new Request(App.DEFAULT_ARCHITECTURE);

    parser.getArgument = name => {
        if (name === undefined) {
            return parsedFile;
        }
        return null;
    };

    app.run();

    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('fails if no program file is passed', () => {
    parser.getArgument = () => null;

    expect(() => app.run()).toThrow(new AppException('No program file given'));
});

test('wraps unsupported architecture exception', () => {
    controller.runProgram = request => {
        if (request.getArchitecture() === parsedArchitecture) {
            throw new UnsupportedArchitectureException(parsedArchitecture);
        }
    };

    expect(() => app.run()).toThrow(new AppException(`Unsupported architecture "${parsedArchitecture}"`));
});

test('wraps generic exception', () => {
    const message = 'message';

    controller.runProgram = () => {
        throw new Error(message);
    };

    expect(() => app.run()).toThrow(new AppException(message));
});
