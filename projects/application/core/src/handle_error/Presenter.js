const Response = require('./Response');

/**
 * @interface
 */
module.exports = class Core_HandleError_Presenter {
    constructor() {
        if (new.target === Core_HandleError_Presenter) {
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
