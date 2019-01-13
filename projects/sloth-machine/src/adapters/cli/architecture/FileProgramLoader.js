const ProgramLoader = require('core').ProgramLoader;
const ProgramLoaderException = require('core').ProgramLoaderException;
const FileReader = require('./FileReader');

module.exports = class FileProgramLoader extends ProgramLoader {
    static get __DEPS__() { return [ FileReader, 'adapters.cli.architecture.program_file' ]; }

    /**
     * @param {FileReader} fileReader
     * @param {string} file
     */
    constructor(fileReader, file) {
        super();
        this._fileReader = fileReader;
        this._file = file;
    }

    /**
     * @inheritDoc
     */
    load() {
        try {
            return this._fileReader.read(this._file, { encoding: 'binary' });
        } catch (e) {
            throw new ProgramLoaderException(`Invalid program file given: "${this._file}"`);
        }
    }
};
