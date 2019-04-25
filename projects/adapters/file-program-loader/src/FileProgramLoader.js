const _package = 'SlothMachine.FileProgramLoader.';

const ProgramLoader = require('app/program-loader').ProgramLoader;
const InvalidProgramException = require('app/program-loader').InvalidProgramException;
const FileReader = require('./FileReader');
const FileReaderException = require('./FileReaderException');
const Program = require('domain/sloth-machine-framework').program.Program;
const Data = require('domain/sloth-machine-framework').data.Data;
const DataUnit = require('domain/sloth-machine-framework').data.DataUnit;

module.exports = class FileProgramLoader extends ProgramLoader {
    static get __DEPS__() { return [ FileReader ]; }
    static toString() { return _package + FileProgramLoader.name; }

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
