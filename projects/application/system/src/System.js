const _package = 'SlothMachine.System.';

const DomainSystem = require('domain/sloth-machine-framework').architecture.System;

/**
 * @interface
 */
module.exports = class System extends DomainSystem {
    static toString() { return _package + System.name; }

    // @todo: add interface methods
};
