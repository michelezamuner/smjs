module.exports = class SlothMachine_Core_HandleError_Presenters_SharedPresenter_ViewModel {
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
