/**
 * @interface
 */
module.exports = class MessageBus {
    constructor() {
        if (new.target === MessageBus) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Function[]} types
     * @param {Function} handler
     */
    register(types, handler) {
        throw 'Not implemented';
    }

    /**
     * @param {Object} message
     */
    send(message) {
        throw 'Not implemented';
    }
};
