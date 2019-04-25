const _package = 'SlothMachine.SlothMachine.Core.HandleError.Presenters.SharedPresenter.';

module.exports = class Response {
    static toString() { return _package + Response.name; }

    /**
     * @param {Error} error
     */
    constructor(error) {
        this._error = error;
    }

    /**
     * @return {Error}
     */
    getError() {
        return this._error;
    }
};
