const _package = 'SlothMachine.Core.HandleError.';

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
     * @return {Error}
     */
    getError() {
        throw 'Not implemented';
    }
};
