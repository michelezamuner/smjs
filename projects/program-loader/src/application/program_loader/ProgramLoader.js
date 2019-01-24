const Program = require('framework').Program;
const InvalidProgramException = require('./InvalidProgramException');

module.exports = class ProgramLoader {
    /**
     * @param {String} programReference
     * @return {Program}
     * @throws {InvalidProgramException}
     */
    load(programReference) {
        throw 'Not implemented'
    }
};
