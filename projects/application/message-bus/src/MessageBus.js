/**
 * @interface
 */
module.exports = class MessageBus_MessageBus {
    constructor() {
        if (new.target === MessageBus_MessageBus) {
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
