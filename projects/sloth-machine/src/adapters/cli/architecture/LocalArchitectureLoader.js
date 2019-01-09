const ArchitectureLoader = require('core').ArchitectureLoader;
const ArchitecturesDirectoryProvider = require('./ArchitecturesDirectoryProvider');
const ProgramLoader = require('core').ProgramLoader;
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const fs = require('fs');

module.exports = class LocalArchitectureLoader extends ArchitectureLoader {
    static get __DEPS__() { return [ ArchitecturesDirectoryProvider, ProgramLoader ]; }

    /**
     * @param {ArchitecturesDirectoryProvider} directoryProvider
     * @param {ProgramLoader} programLoader
     */
    constructor(directoryProvider, programLoader) {
        super();
        this._directoryProvider = directoryProvider;
        this._programLoader = programLoader;
    }

    /**
     * @inheritDoc
     */
    load(name) {
        const architectureDir = this._directoryProvider.getDirectory() + '/' + name;
        if (!fs.existsSync(architectureDir)) {
            throw new UnsupportedArchitectureException(name);
        }

        const architectureClass = require(architectureDir + '/lib').Architecture;

        return new architectureClass(this._programLoader);
    }
};
