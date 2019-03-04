const Program = require('domain/sloth-machine-framework').program.Program;
const InvalidProgramException = require('./InvalidProgramException');

/**
 * @interface
 */
module.exports = class ProgramLoader {
    constructor() {
        if (new.target === ProgramLoader) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {String} programReference
     * @return {Program}
     * @throws {InvalidProgramException}
     */
    load(programReference) {
        throw 'Not implemented'
    }
};
