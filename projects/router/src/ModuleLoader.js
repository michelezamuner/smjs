const ModuleLoaderException = require('./ModuleLoaderException');

/**
 * @interface
 */
module.exports = class ModuleLoader {
    constructor() {
        if (new.target === ModuleLoader) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} path
     * @return {Object}
     * @throws {ModuleLoaderException}
     */
    load(path) {
        throw 'Not implemented';
    }
};
