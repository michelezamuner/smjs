const _package = 'FindBooks.ServiceApplication.';

const MessageBus = require('message-bus').MessageBus;
const Connection = require('./server/Connection');

module.exports = class ApplicationFactory {
    static toString() { return _package + ApplicationFactory.name; }

    constructor() {
        if (new.target === ApplicationFactory) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {MessageBus} bus 
     * @param {Connection} connection 
     */
    create(bus, connection) {
        throw 'Not implemented';
    }
};