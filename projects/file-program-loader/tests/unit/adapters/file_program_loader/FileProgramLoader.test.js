const FileProgramLoader = require('../../../../src/adapters/file_program_loader/FileProgramLoader');
const InvalidProgramException = require('program-loader').InvalidProgramException;
const FileReader = require('../../../../src/adapters/file_program_loader/FileReader');
const FileReaderException = require('../../../../src/adapters/file_program_loader/FileReaderException');

/**
 * @type {Object}
 */
const fileReader = {};

/**
 * @type {string}
 */
const file = 'file';

/**
 * @type {null|FileProgramLoader}
 */
let loader = null;

beforeEach(() => {
    fileReader.read = jest.fn();
    loader = new FileProgramLoader(fileReader);
});

test('can be injected', () => {
    expect(FileProgramLoader.__DEPS__).toStrictEqual([FileReader]);
});

test('loads binary program from given file', () => {
    loader.load(file);

    expect(fileReader.read.mock.calls[0][0]).toStrictEqual(file);
    expect(fileReader.read.mock.calls[0][1]).toStrictEqual({ encoding: 'binary' });
});

test('wraps file reader exception', () => {
    fileReader.read = ref => {
        if (ref === file) {
            throw new FileReaderException();
        }
    };

    let thrown = false;
    try {
        loader.load(file);
    } catch (e) {
        thrown = true;
        expect(e).toBeInstanceOf(InvalidProgramException);
        expect(e.getProgramReference()).toBe(file);
    }
    expect(thrown).toBe(true);
});

test('forwards generic exceptions', () => {
    const GenericException = class extends Error {};
    const genericException = 'genericException';
    fileReader.read = ref => {
        if (ref === file) {
            throw new GenericException(genericException);
        }
    };

    expect(() => loader.load(file)).toThrow(GenericException);
    expect(() => loader.load(file)).toThrow(genericException);
});
