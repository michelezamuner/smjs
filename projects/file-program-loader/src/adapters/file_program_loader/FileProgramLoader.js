const ProgramLoader = require('program-loader').ProgramLoader;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');

module.exports = class FileProgramLoader extends ProgramLoader {
    static get __DEPS__() { return [ FileReader ]; }

    /**
     * @param {FileReader} fileReader
     */
    constructor(fileReader) {
        super();
        this._fileReader = fileReader;
    }

    /**
     * @inheritDoc
     */
    load(programReference) {
        try {
            return this._fileReader.read(programReference, { encoding: 'binary' });
        } catch (e) {
            if (e instanceof FileReaderException) {
                throw new InvalidProgramException(programReference);
            }
            throw e;
        }
    }
};
