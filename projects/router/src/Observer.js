const Input = require('./Input');

/**
 * @interface
 */
module.exports = class Observer {
    constructor() {
        if (new.target === Observer) {
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
