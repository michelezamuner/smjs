/**
 * @interface
 */
module.exports = class Logger_Handler {
    constructor() {
        if (new.target === Logger_Handler) {
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
