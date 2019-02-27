const PresenterInterface = require('application').application.application.handle_error.Presenter;
const SharedPresenter = require('../shared_presenter/Presenter');
const SharedResponse = require('../shared_presenter/Response');

/**
 * Console presenter for the console_application/handle_error use case.
 *
 * Represents console error output, with a single error message to be displayed.
 * Primary port: application
 * Primary adapter: console_application
 * Use case: handle_error
 */
module.exports = class Presenter extends PresenterInterface {
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
