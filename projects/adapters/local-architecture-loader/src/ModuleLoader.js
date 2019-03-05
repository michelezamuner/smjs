const CannotFindModuleException = require('./CannotFindModuleException');

/**
 * @interface
 */
module.exports = class LocalArchitectureLoader_ModuleLoader {
    constructor() {
        if (new.target === LocalArchitectureLoader_ModuleLoader) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} module
     * @return {Object}
     * @throws {CannotFindModuleException}
     */
    load(module) {
        throw 'Not implemented';
    }
};
