const Provider = require('./Provider');
const Container = require('lib/container').Container;
const RouterObserver = require('lib/router').Observer;
const ViewsProvider = require('./ViewsProvider');
const MessageBus = require('app/message-bus').MessageBus;
const SimpleMessageBus = require('simple-message-bus').SimpleMessageBus;

module.exports = class AppProvider extends Provider {
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
        this._container.bind(RouterObserver, ViewsProvider);
        this._container.bind('router.config', config.router);
        this._container.bind(MessageBus, new SimpleMessageBus());
    }
};
