const _package = 'SensorSystem.Config.';

const Container = require('container').Container;
const Actuator = require('../src/application/actuator/Actuator');
const FileActuator = require('../src/adapters/file-actuator/FileActuator');
const Notifier = require('../src/application/notifications/Notifier');
const BusNotifier = require('../src/adapters/bus-notifications/BusNotifier');
const Writer = require('../src/adapters/file-actuator/Writer');
const NativeWriter = require('../src/adapters/file-actuator/NativeWriter');
const MessageBus = require('message-bus').MessageBus;
const ActuatorActivated = require('../src/application/sensor/send_signal/messages/ActuatorActivated');
const NativeServerHandler = require('../src/adapters/sensor-system/sensor/send_signal/NativeServerHandler');
const SignalHandler = require('../src/adapters/sensor-system/sensor/send_signal/SignalHandler');

module.exports = class Provider {
    static get __DEPS__() { return [ Container ]; }
    static toString() { return _package + Provider.name; }

    /**
     * @param {Container} container
     */
    constructor(container) {
        this._container = container;
    }

    register() {
        const config = this._container.make('config');

        this._container.bind('router.config', config.router);
        this._container.bind(Actuator, FileActuator);
        this._container.bind(Notifier, BusNotifier);
        this._container.bind(Writer, NativeWriter);
        this._container.bind('file_actuator.output_file', config.file_actuator.output_file);
        this._container.bind(NativeServerHandler, SignalHandler);

        const bus = new MessageBus();
        bus.register([ActuatorActivated], msg => {
            const signal = msg.getSignal().getValue();
            process.stdout.write(`Actuator activated with signal: ${signal}`);
        });
        this._container.bind(MessageBus, bus);
    }
};
