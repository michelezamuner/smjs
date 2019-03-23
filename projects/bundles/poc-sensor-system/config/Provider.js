const Container = require('container').Container;
const RouterObserver = require('router').Observer;
const Actuator = require('../src/application/actuator/Actuator');
const FileActuator = require('../src/adapters/file-actuator/FileActuator');
const Notifier = require('../src/application/notifications/Notifier');
const BusNotifier = require('../src/adapters/bus-notifications/BusNotifier');
const Writer = require('../src/adapters/file-actuator/Writer');
const NativeWriter = require('../src/adapters/file-actuator/NativeWriter');
const MessageBus = require('message-bus').MessageBus;
const ActuatorActivated = require('../src/application/sensor/send_signal/messages/ActuatorActivated');

module.exports = class Provider {
    static get __DEPS__() { return [ Container ]; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        this._container = container;
    }

    register() {
        const config = this._container.make('config');

        this._container.bind('router.config', config.router);
        this._container.bind(RouterObserver, { observe: () => {} });
        this._container.bind(Actuator, FileActuator);
        this._container.bind(Notifier, BusNotifier);
        this._container.bind(Writer, NativeWriter);
        this._container.bind('file_actuator.output_file', config.file_actuator.output_file);

        const bus = new MessageBus();
        bus.register([ActuatorActivated], msg => {
            const signal = msg.getSignal().getValue();
            console.log(`Actuator activated with signal: ${signal}`);
        });
        this._container.bind(MessageBus, bus);

    }
};
