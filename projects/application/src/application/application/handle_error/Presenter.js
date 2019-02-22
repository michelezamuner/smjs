const Response = require('./Response');

/**
 * @interface
 */
module.exports = class Presenter {
    /**
     * @param {Response} response
     */
    present(response) {
        throw 'Not implemented';
    }
};
