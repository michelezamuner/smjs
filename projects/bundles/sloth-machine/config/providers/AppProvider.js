const Provider = require('./Provider');
const Container = require('container').Container;
const Notifier = require('app/notifications').Notifier;
const BusNotifier = require('adapters/bus-notifications').BusNotifier;
const MessageBus = require('message-bus').MessageBus;

module.exports = class SlothMachine_Providers_AppProvider extends Provider {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        super();
        this._container = container;
    }

    /**
     * @override
     */
    register() {
        const config = require('../config');

        this._container.bind('config', config);
        this._container.bind('router.config', config.router);
        this._container.bind(MessageBus, new MessageBus());
        this._container.bind(Notifier, this._container.make(BusNotifier));
    }
};
