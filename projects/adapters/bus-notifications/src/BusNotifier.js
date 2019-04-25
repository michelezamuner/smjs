const _package = 'SlothMachine.BusNotifications.';

const Notifier = require('app/notifications').Notifier;
const MessageBus = require('message-bus').MessageBus;

module.exports = class BusNotifier extends Notifier {
    static get __DEPS__() { return [ MessageBus ]; }
    static toString() { return _package + BusNotifier.name; }

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
