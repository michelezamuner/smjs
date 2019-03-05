/**
 * @interface
 */
module.exports = class VirtualMachine_RunProgram_Request {
    constructor() {
        if (new.target === VirtualMachine_RunProgram_Request) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {string}
     */
    getArchitectureName() {
        throw 'Not implemented'
    }

    /**
     * @return {string}
     */
    getProgramReference() {
        throw 'Not implemented'
    }
};
