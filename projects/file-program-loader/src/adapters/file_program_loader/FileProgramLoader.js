const ProgramLoader = require('program-loader').ProgramLoader;
const InvalidProgramException = require('program-loader').InvalidProgramException;
const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');
const Program = require('sloth-machine-framework').Program;
const Data = require('sloth-machine-framework').Data;
const DataUnit = require('sloth-machine-framework').DataUnit;

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
     * @override
     */
    load(programReference) {
        const binary = this._loadBinary(programReference);

        if (binary === '') {
            throw new InvalidProgramException(`Program file "${programReference}" is empty`);
        }

        return new Program(new Data(binary.split('').map(char => new DataUnit(char.charCodeAt(0)))));
    }

    /**
     * @param {string} programReference
     * @return {string}
     * @private
     */
    _loadBinary(programReference) {
        try {
            return this._fileReader.read(programReference, { encoding: 'binary' });
        } catch (e) {
            if (e instanceof FileReaderException) {
                throw new InvalidProgramException(`Program file "${programReference}" cannot be loaded`);
            }
            throw e;
        }
    }
};
