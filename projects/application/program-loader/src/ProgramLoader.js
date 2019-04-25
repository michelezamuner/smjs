const _package = 'SlothMachine.ProgramLoader.';

const Program = require('domain/sloth-machine-framework').program.Program;
const InvalidProgramException = require('./InvalidProgramException');

/**
 * @interface
 */
module.exports = class ProgramLoader {
    static toString() { return _package + ProgramLoader.name; }

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
