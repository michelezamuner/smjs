const PresenterInterface = require('virtual-machine').Presenter;
const View = require('./View');
const Response = require('virtual-machine').Response;
const ViewModel = require('./ViewModel');

module.exports = class Presenter extends PresenterInterface {
    static get __DEPS__() { return [View]; }

    /**
     * @param {View} view
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @param {Response} response
     */
    present(response) {
        const viewModel = new ViewModel(response.getExitStatus());
        this._view.render(viewModel);
    }
};
