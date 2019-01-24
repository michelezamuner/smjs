const ModuleLoaderException = require('./ModuleLoaderException');

module.exports = class ModuleLoader {
    /**
     * @param {string} module
     * @return {Object}
     * @throws {ModuleLoaderException}
     */
    load(module) {
        throw 'Not implemented';
    }
};
