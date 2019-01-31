const App = require('../../../src/app/App');
const Parser = require('command-line-parser').CommandLineParser;
const Container = require('container').Container;
const RunProgramController = require('../../../src/adapters/sloth_machine/run_program/Controller');
const Request = require('../../../src/adapters/sloth_machine/run_program/Request');
const Console = require('../../../src/adapters/sloth_machine/run_program/Console');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

/**
 * @type {Object|Container}
 */
const container = {};

/**
 * @type {Object|Parser}
 */
const parser = {};

/**
 * @type {Object|RunProgramController}
 */
const controller = {};

/**
 * @type {Object|Console}
 */
const console = {};

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
    parser.getArgument = name => {
        switch (name) {
            case App.CLI_ARG_ARCHITECTURE: return parsedArchitecture;
            case undefined: return parsedFile;
        }

        return null;
    };
    controller.runProgram = jest.fn();
    console.exit = jest.fn();

    container.make = type => {
        switch (type) {
            case Parser: return parser;
            case RunProgramController: return controller;
            case Console: return console;
        }

        return null;
    };

    app = new App(container);
});

test('forwards execution to controller', () => {
    const expectedRequest = new Request(parsedArchitecture, parsedFile);

    app.run();

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

    app.run();

    expect(controller.runProgram.mock.calls[0][0]).toStrictEqual(expectedRequest);
});

test('prints error if no program file is passed', () => {
    parser.getArgument = () => null;

    app.run();

    expect(console.exit.mock.calls[0][0]).toStrictEqual('No program file given');
    expect(console.exit.mock.calls[0][1]).toStrictEqual(127);
});

test('prints error if unsupported architecture exception', () => {
    controller.runProgram = request => {
        if (request.getArchitectureName() === parsedArchitecture) {
            throw new UnsupportedArchitectureException(parsedArchitecture);
        }
    };

    app.run();

    expect(console.exit.mock.calls[0][0]).toStrictEqual(`Cannot find selected architecture "${parsedArchitecture}"`);
    expect(console.exit.mock.calls[0][1]).toStrictEqual(127);
});

test('prints error if invalid architecture exception', () => {
    controller.runProgram = request => {
        if (request.getArchitectureName() === parsedArchitecture) {
            throw new InvalidArchitectureException(parsedArchitecture);
        }
    };

    app.run();

    expect(console.exit.mock.calls[0][0]).toStrictEqual(`Selected architecture "${parsedArchitecture}" has invalid implementation`);
    expect(console.exit.mock.calls[0][1]).toStrictEqual(127);
});

test('prints error if invalid program exception', () => {
    const message = 'message';
    controller.runProgram = request => {
        if (request.getProgramReference() === parsedFile) {
            throw new InvalidProgramException(message);
        }
    };

    app.run();

    expect(console.exit.mock.calls[0][0]).toStrictEqual(`Invalid program file given: ${message}`);
    expect(console.exit.mock.calls[0][1]).toStrictEqual(127);
});

test('prints error if generic exception', () => {
    const error = new Error('error');

    controller.runProgram = () => {
        throw error
    };

    app.run();

    expect(console.exit.mock.calls[0][0]).toStrictEqual(error);
    expect(console.exit.mock.calls[0][1]).toStrictEqual(127);
});
