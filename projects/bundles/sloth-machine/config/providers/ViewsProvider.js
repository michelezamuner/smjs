const _package = 'SlothMachine.SlothMachine.Config.Providers.';

const Provider = require('./Provider');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const RequestReceived = require('../../src/RequestReceived');
const ViewRegistered = require('../../src/ViewRegistered');

module.exports = class ViewsProvider extends Provider {
    static get __DEPS__() { return [ Container ]; }
    static toString() { return _package + ViewsProvider.name; }

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
        const config = this._container.make('config');
        const bus = this._container.make(MessageBus);

        bus.register([RequestReceived], msg => {
            const useCase = config.ui.use_cases[msg.getEndpoint()];
            if (useCase === undefined) {
                throw new Error(`Use case "${msg.getEndpoint()}" is not supported.`);
            }

            if (useCase.dependencies !== undefined) {
                for (const dependency of useCase.dependencies) {
                    this._bindComponents(config.ui.use_cases[dependency], msg.getRepresentation());
                }
            }
            this._bindComponents(useCase, msg.getRepresentation());

            bus.send(new ViewRegistered(msg.getEndpoint(), msg.getParameters()));
        });
    }

    /**
     * @param {Object} useCase
     * @param {string} representation
     * @private
     */
    _bindComponents(useCase, representation) {
        for (const outputModel of useCase.output_models) {
            for (const repr in outputModel.views) {
                if (repr !== representation && repr !== '*') {
                    continue;
                }

                this._container.bind(useCase.presenter, outputModel.presenter);

                const view = outputModel.views[repr];
                if (view === undefined) {
                    throw new Error(`Representation "${representation}" is not supported.`);
                }

                this._container.bind(outputModel.view, view);

                return;
            }
        }
    }
};
