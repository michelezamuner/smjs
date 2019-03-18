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
     * @param {Object} message
     */
    send(message) {
        throw 'Not implemented';
    }
};
