const FileProgramLoader = require('../../../../../src/adapters/cli/architecture/FileProgramLoader');
const ProgramLoaderException = require('core').ProgramLoaderException;
const FileReader = require('../../../../../src/adapters/cli/architecture/FileReader');
const FileReaderException = require('../../../../../src/adapters/cli/architecture/FileReaderException');

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
    loader = new FileProgramLoader(fileReader, file);
});

test('can be injected', () => {
    expect(FileProgramLoader.__DEPS__).toStrictEqual([FileReader, 'adapters.cli.architecture.program_file']);
});

test('loads binary program from given file', () => {
    loader.load();

    expect(fileReader.read.mock.calls[0][0]).toStrictEqual(file);
    expect(fileReader.read.mock.calls[0][1]).toStrictEqual({ encoding: 'binary' });
});

test('wraps file reader exception', () => {
    fileReader.read = () => { throw new FileReaderException() };

    expect(() => loader.load()).toThrow(new ProgramLoaderException(`Invalid program file given: "${file}"`));
});
