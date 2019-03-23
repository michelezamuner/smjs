const Notifier = require('app/notifications').Notifier;
const MessageBus = require('message-bus').MessageBus;

module.exports = class BusNotifications_BusNotifier extends Notifier {
    static get __DEPS__() { return [ MessageBus ]; }

    /**
     * @param {MessageBus} bus
     */
    constructor(bus) {
        super();
        this._bus = bus;
    }

    /**
     * @override
     */
    notify(message) {
        this._bus.send(message);
    }
};
