const Architecture = require('domain/sloth-machine-framework').architecture.Architecture;
const UnsupportedArchitectureException = require('./UnsupportedArchitectureException');
const InvalidArchitectureException = require('./InvalidArchitectureException');

/**
 * @interface
 */
module.exports = class ArchitectureLoader_ArchitectureLoader {
    constructor() {
        if (new.target === ArchitectureLoader_ArchitectureLoader) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} architectureName
     * @return {Architecture}
     * @throws {UnsupportedArchitectureException}
     * @throws {InvalidArchitectureException}
     */
    load(architectureName) {
        throw 'Not implemented';
    }
};
