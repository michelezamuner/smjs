/**
 * @interface
 */
module.exports = class Core_HandleError_Request {
    constructor() {
        if (new.target === Core_HandleError_Request) {
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
