const FileProgramLoader = require('../../../../src/adapters/file_program_loader/FileProgramLoader');
const InvalidProgramException = require('app/program-loader').InvalidProgramException;
const FileReader = require('../../../../src/adapters/file_program_loader/FileReader');
const FileReaderException = require('../../../../src/adapters/file_program_loader/FileReaderException');
const Program = require('domain/sloth-machine-framework').program.Program;
const Data = require('domain/sloth-machine-framework').data.Data;
const DataUnit = require('domain/sloth-machine-framework').data.DataUnit;

/**
 * @type {Object}
 */
const fileReader = {};

/**
 * @type {null|FileProgramLoader}
 */
let loader = null;

/**
 * @type {string}
 */
const file = 'file';

/**
 * @type {string}
 */
const binary = 'a !#34s+q2';

/**
 * @type {Program}
 */
const expected = new Program(new Data([
    new DataUnit(97),
    new DataUnit(32),
    new DataUnit(33),
    new DataUnit(35),
    new DataUnit(51),
    new DataUnit(52),
    new DataUnit(115),
    new DataUnit(43),
    new DataUnit(113),
    new DataUnit(50),
]));

beforeEach(() => {
    fileReader.read = jest.fn(ref => ref === file ? binary : null);
    loader = new FileProgramLoader(fileReader);
});

test('can be injected', () => {
    expect(FileProgramLoader.__DEPS__).toStrictEqual([FileReader]);
});

test('loads binary program from given file', () => {
    const program = loader.load(file);

    expect(fileReader.read.mock.calls[0][0]).toStrictEqual(file);
    expect(fileReader.read.mock.calls[0][1]).toStrictEqual({ encoding: 'binary' });
    expect(program).toStrictEqual(expected);
});

test('fails if file is empty', () => {
    fileReader.read = ref => ref === file ? '' : null;

    expect(() => loader.load(file)).toThrow(InvalidProgramException);
    expect(() => loader.load(file)).toThrow(`Program file "${file}" is empty`);
});

test('fails if file cannot be loaded', () => {
    fileReader.read = ref => {
        if (ref === file) {
            throw new FileReaderException();
        }
    };

    expect(() => loader.load(file)).toThrow(InvalidProgramException);
    expect(() => loader.load(file)).toThrow(`Program file "${file}" cannot be loaded`);
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
