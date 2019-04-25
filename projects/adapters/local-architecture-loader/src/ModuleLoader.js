const _package = 'SlothMachine.LocalArchitectureLoader.';

const CannotFindModuleException = require('./CannotFindModuleException');

/**
 * @interface
 */
module.exports = class ModuleLoader {
    static toString() { return _package + ModuleLoader.name; }

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
