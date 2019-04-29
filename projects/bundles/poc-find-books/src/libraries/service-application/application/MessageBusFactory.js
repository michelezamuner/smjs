const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;

module.exports = class MessageBusFactory {
    static toString() { return _package + MessageBusFactory.name; }

    /**
     * @return {MessageBus}
     */
    create() {
        return new MessageBus();
    }
};
