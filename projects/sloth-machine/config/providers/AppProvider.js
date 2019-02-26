const Provider = require('../../src/app/Provider');
const Container = require('container').Container;
const RouterObserver = require('router').Observer;
const ViewsProvider = require('./ViewsProvider');
const Console = require('ui-console').Console;
const NativeConsole = require('ui-console').NativeConsole;

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
        this._container.bind(Console, NativeConsole);
    }
};
