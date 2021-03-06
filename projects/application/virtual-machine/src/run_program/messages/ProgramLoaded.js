const _package = 'SlothMachine.VirtualMachine.RunProgram.Messages.';

const Program = require('domain/sloth-machine-framework').program.Program;

module.exports = class ProgramLoaded {
    static toString() { return _package + ProgramLoaded.name; }

    /**
     * @param {Program} program
     * @param {string} reference
     */
    constructor(program, reference) {
        this._program = program;
        this._reference = reference;
    }

    /**
     * @return {string}
     */
    getProgramReference() {
        return this._reference;
    }

    /**
     * @return {Program}
     */
    getProgram() {
        return this._program;
    }
};
