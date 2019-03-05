const View = require('./View');
const Response = require('./Response');
const ViewModel = require('./ViewModel');

module.exports = class SlothMachine_Core_HandleError_Presenters_SharedPresenter_Presenter {
    static get __DEPS__() { return [View]; }

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
