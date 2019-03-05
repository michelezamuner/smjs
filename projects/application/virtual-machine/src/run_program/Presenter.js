const Response = require('./Response');

/**
 * @interface
 */
module.exports = class VirtualMachine_RunProgram_Presenter {
    constructor() {
        if (new.target === VirtualMachine_RunProgram_Presenter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Response} response
     */
    present(response) {
        throw 'Not implemented';
    }
};
