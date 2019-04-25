const _package = 'SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.';

module.exports = class ViewModel {
    static toString() { return _package + ViewModel.name; }

    /**
     * @param {string} error
     */
    constructor(error) {
        this._error = error;
    }

    /**
     * @return {string}
     */
    getError() {
        return this._error;
    }
};
