const _package = 'Router.';

const Request = require('./Request');

/**
 * @interface
 */
module.exports = class Controller {
    static toString() { return _package + Controller.name; }

    constructor() {
        if (new.target === Controller) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Request} request
     */
    control(request) {
        throw 'Not implemented';
    }
};
