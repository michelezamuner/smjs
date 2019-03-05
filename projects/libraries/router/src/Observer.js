const Input = require('./Input');

/**
 * @interface
 */
module.exports = class Router_Observer {
    constructor() {
        if (new.target === Router_Observer) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Input} input
     */
    observe(input) {
        throw 'Not implemented';
    }
};
