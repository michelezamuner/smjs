const Container = require('lib/container').Container;
const RouterObserver = require('lib/router').Observer;
const Input = require('lib/router').Input;

module.exports = class RoutesProvider extends RouterObserver {
    static get __DEPS__() { return [Container]; }
    constructor(container) {
        super();
        this._container = container;
        this._useCases = this._container.make('config').ui.use_cases;
    }

    /**
     * @override
     */
    observe(input) {
        for (const useCase of this._useCases) {
            this._provideUseCase(useCase, input);
        }
    }

    /**
     * @param {Object} useCase
     * @param {Input} input
     * @private
     */
    _provideUseCase(useCase, input) {
        const presenterInterface = useCase.presenter;
        for (const outputModel of useCase.output_models) {
            const presenter = outputModel.presenter;
            const viewInterface = outputModel.view;
            for (const reference in outputModel.views) {
                if (reference !== input.getRepresentation() && reference !== '*') {
                    continue;
                }
                this._container.bind(presenterInterface, presenter);
                const view = outputModel.views[reference];
                if (view === undefined) {
                    throw new Error(`Representation "${input.getRepresentation()}" is not supported.`);
                }
                this._container.bind(viewInterface, view);

                return;
            }
        }
    }
};
