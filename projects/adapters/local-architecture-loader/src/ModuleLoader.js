const CannotFindModuleException = require('./CannotFindModuleException');

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
     * @param {string} module
     * @return {Object}
     * @throws {CannotFindModuleException}
     */
    load(module) {
        throw 'Not implemented';
    }
};
