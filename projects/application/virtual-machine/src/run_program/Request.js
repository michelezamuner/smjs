const _package = 'SlothMachine.VirtualMachine.RunProgram.';

/**
 * @interface
 */
module.exports = class Request {
    static toString() { return _package + Request.name; }

    constructor() {
        if (new.target === Request) {
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
