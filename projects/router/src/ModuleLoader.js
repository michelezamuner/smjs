const ModuleLoaderException = require('./ModuleLoaderException');

module.exports = class ModuleLoader {
    /**
     * @param {string} path
     * @return {Object}
     * @throws {ModuleLoaderException}
     */
    load(path) {
        throw 'Not implemented';
    }
};
