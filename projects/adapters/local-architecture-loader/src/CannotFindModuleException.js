const _package = 'SlothMachine.LocalArchitectureLoader.';

/**
 * Thrown when the given module cannot be found
 */
module.exports = class CannotFindModuleException extends Error {
    static toString() { return _package + CannotFindModuleException.name; }
};
