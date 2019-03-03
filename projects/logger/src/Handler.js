/**
 * @interface
 */
module.exports = class Handler {
    constructor() {
        if (new.target === Handler) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {string} message
     */
    handle(message) {
        throw 'Not implemented';
    }
};
