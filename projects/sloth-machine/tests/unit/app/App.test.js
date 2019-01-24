const App = require('../../../src/app/App');
const Parser = require('command-line-parser').CommandLineParser;
const Container = require('container').Container;
const Provider = require('../../../src/app/Provider');
const RunProgramController = require('../../../src/adapters/sloth-machine/run_program/Controller');
const Request = require('../../../src/adapters/sloth-machine/run_program/Request');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;
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
    app = new App(container, provider);
});

test('forwards execution to controller', () => {
    const expectedRequest = new Request(parsedArchitecture, parsedFile);

    app.run(parser);

    expect(provider.register.mock.calls[0][0]).toStrictEqual(container);
    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('uses default architecture', () => {
    const expectedRequest = new Request(App.DEFAULT_ARCHITECTURE, parsedFile);

    parser.getArgument = name => {
        if (name === undefined) {
            return parsedFile;
        }
        return null;
    };

    app.run(parser);

    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('fails if no program file is passed', () => {
    parser.getArgument = () => null;

    expect(() => app.run(parser)).toThrow(new AppException('No program file given'));
});

test('wraps unsupported architecture exception', () => {
    controller.runProgram = request => {
        if (request.getArchitectureName() === parsedArchitecture) {
            throw new UnsupportedArchitectureException(parsedArchitecture);
        }
    };

    expect(() => app.run(parser)).toThrow(AppException);
    expect(() => app.run(parser)).toThrow(`Cannot find selected architecture "${parsedArchitecture}"`);
});

test('wraps invalid architecture exception', () => {
    controller.runProgram = request => {
        if (request.getArchitectureName() === parsedArchitecture) {
            throw new InvalidArchitectureException(parsedArchitecture);
        }
    };

    expect(() => app.run(parser)).toThrow(AppException);
    expect(() => app.run(parser)).toThrow(`Selected architecture "${parsedArchitecture}" has invalid implementation`);
});

test('wraps invalid program exception', () => {
    controller.runProgram = request => {
        if (request.getProgramReference() === parsedFile) {
            throw new InvalidProgramException(parsedFile);
        }
    };

    expect(() => app.run(parser)).toThrow(AppException);
    expect(() => app.run(parser)).toThrow(`Invalid program file given: "${parsedFile}"`);
});

test('forwards generic exception', () => {
    const message = 'message';

    controller.runProgram = () => {
        throw new Error(message);
    };

    expect(() => app.run(parser)).toThrow(Error);
    expect(() => app.run(parser)).toThrow(message);
});
