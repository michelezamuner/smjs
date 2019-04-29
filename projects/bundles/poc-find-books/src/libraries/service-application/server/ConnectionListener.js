const _package = 'FindBooks.ServiceApplication.Server.';

const MessageBus = require('message-bus').MessageBus;
const ConnectionEstablished = require('../messages/ConnectionEstablished');

module.exports = class ConnectionListener {
    static get __DEPS__() { return [ MessageBus ]; }
    static toString() { return _package + ConnectionListener.name; }

    /**
     * @param {MessageBus} bus
     */
    constructor(bus) {
        this._bus = bus;
    }

    /**
     * @override
     */
    listen(connection) {
        this._bus.send(new ConnectionEstablished(connection));
    };
};
