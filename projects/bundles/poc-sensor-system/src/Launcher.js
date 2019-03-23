const Container = require('container').Container;
const Provider = require('../config/Provider');
const SignalListener = require('./adapters/sensor-system/sensor/send_signal/SignalListener');

module.exports = class Launcher {
    /**
     * @param {Container} container
     * @param {Object} config
     */
    constructor(container, config) {
        this._container = container;
        this._config = config;
    }

    launch() {
        this._container.bind('config', this._config);
        this._container.make(Provider).register();

        const listener = this._container.make(SignalListener);

        listener.listen(this._config.signal_listener.host, this._config.signal_listener.port);
    }
};
