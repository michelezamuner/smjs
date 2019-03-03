const MessageBus = require('message-bus').MessageBus;

module.exports = class SimpleMessageBus extends MessageBus {
    constructor() {
        super();
        this._handlers = {};
    }

    /**
     * @override
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
     * @override
     */
    send(message) {
        const handlers = this._handlers[message.constructor] || [];
        for (const handler of handlers) {
            handler(message);
        }
    }
};
