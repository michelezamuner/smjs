const _package = 'SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.';

const View = require('./View');
const Response = require('./Response');
const ViewModel = require('./ViewModel');

module.exports = class Presenter {
    static get __DEPS__() { return [ View ]; }
    static toString() { return _package + Presenter.name; }

    /**
     * @param {View} view
     */
    constructor(view) {
        this._view = view;
    }

    /**
     * @param {Response} response
     */
    present(response) {
        this._view.render(new ViewModel(response.getError().message));
    }
};
