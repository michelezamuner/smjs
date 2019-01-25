const Architecture = require('sloth-machine-framework').Architecture;
const UnsupportedArchitectureException = require('./UnsupportedArchitectureException');
const InvalidArchitectureException = require('./InvalidArchitectureException');

module.exports = class ArchitectureLoader {
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
