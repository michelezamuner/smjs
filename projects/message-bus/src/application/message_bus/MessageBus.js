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
     * @param {Function} type
     * @param {Function} handler
     */
    register(type, handler) {
        throw 'Not implemented';
    }

    /**
     * @param {Object} message
     */
    send(message) {
        throw 'Not implemented';
    }
};
