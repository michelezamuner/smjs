const _package = 'MessageBus.';

module.exports = class MessageBus {
    static toString() { return _package + MessageBus.name; }

    constructor() {
        this._handlers = {};
    }

    /**
     * @param {Function[]} types
     * @param {Function} handler
     */
    register(types, handler) {
        for (const type of types) {
            if (this._handlers[type] === undefined) {
                this._handlers[type] = [];
            }
            this._handlers[type].push(handler);
        }
    }

    /**
     * @param {Object} message
     */
    send(message) {
        const handlers = this._handlers[message.constructor] || [];
        for (const handler of handlers) {
            handler(message);
        }
    }
};
