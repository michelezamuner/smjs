const _package = 'FindBooks.ServiceApplication.';

const MessageBus = require('message-bus').MessageBus;
const Connection = require('./server/Connection');
const ApplicationWidget = require('./widgets/ApplicationWidget');

module.exports = class ApplicationWidgetFactory {
    static toString() { return _package + ApplicationWidgetFactory.name; }

    constructor() {
        if (new.target === ApplicationWidgetFactory) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @return {ApplicationWidget}
     */
    create(bus, connection) {
        throw 'Not implemented';
    }
};