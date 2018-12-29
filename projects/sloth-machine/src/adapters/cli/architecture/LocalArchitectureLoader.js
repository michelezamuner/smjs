const ArchitectureLoader = require('core').ArchitectureLoader;
const UnsupportedArchitectureException = require('core').UnsupportedArchitectureException;
const fs = require('fs');

module.exports = class LocalArchitectureLoader extends ArchitectureLoader {
    /**
     * @param {string} directory
     */
    constructor(directory) {
        super();
        this._directory = directory;
    }

    load(name) {
        const architectureDir = this._directory + '/' + name;
        if (!fs.existsSync(architectureDir)) {
            throw new UnsupportedArchitectureException(name);
        }

        // @todo: implement this
    }
};
