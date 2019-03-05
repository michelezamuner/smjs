const PresenterInterface = require('app/core').handle_error.Presenter;
const SharedPresenter = require('../shared_presenter/Presenter');
const SharedResponse = require('../shared_presenter/Response');

module.exports = class SlothMachine_Core_HandleError_Presenters_ConsolePresenter_Presenter extends PresenterInterface {
    static get __DEPS__() { return [SharedPresenter]; }

    /**
     * @param {SharedPresenter} presenter
     */
    constructor(presenter) {
        super();
        this._presenter = presenter
    }

    /**
     * @override
     */
    present(response) {
        this._presenter.present(new SharedResponse(response.getError()));
    }
};
