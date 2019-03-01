const Program = require('sloth-machine-framework').Program;

module.exports = class ProgramLoaded {
    /**
     * @param {Program} program
     */
    constructor(program) {
        this._program = program;
    }

    /**
     * @return {Program}
     */
    getProgram() {
        return this._program;
    }
};
