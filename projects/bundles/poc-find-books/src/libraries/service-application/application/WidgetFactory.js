const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;

module.exports = class WidgetFactory {
    static toString() { return _package + WidgetFactory.name; }

    /**
     * @param {Function} type
     * @param {MessageBus} bus
     * @param {Array} args
     * @return {*}
     */
    create(type, bus, args) {
        return new type(bus, ...args);
    }
};
