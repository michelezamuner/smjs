const Response = require('./Response');

/**
 * @interface
 */
module.exports = class Presenter {
    constructor() {
        if (new.target === Presenter) {
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
