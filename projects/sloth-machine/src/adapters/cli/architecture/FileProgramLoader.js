const ProgramLoader = require('core').ProgramLoader;
const ProgramLoaderException = require('core').ProgramLoaderException;
const fs = require('fs');

module.exports = class FileProgramLoader extends ProgramLoader {
    /**
     * @param {string} file
     */
    constructor(file) {
        super();
        this._file = file;
    }

    /**
     * @inheritDoc
     */
    load() {
        try {
            return fs.readFileSync(this._file, { encoding: 'binary' });
        } catch (e) {
            throw new ProgramLoaderException(`Invalid program file given: "${this._file}"`);
        }
    }
};
