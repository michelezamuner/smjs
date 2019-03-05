const Program = require('domain/sloth-machine-framework').program.Program;
const InvalidProgramException = require('./InvalidProgramException');

/**
 * @interface
 */
module.exports = class ProgramLoader_ProgramLoader {
    constructor() {
        if (new.target === ProgramLoader_ProgramLoader) {
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
