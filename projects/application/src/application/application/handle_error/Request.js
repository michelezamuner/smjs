/**
 * @interface
 */
module.exports = class Request {
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
