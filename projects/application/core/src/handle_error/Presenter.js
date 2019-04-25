const _package = 'SlothMachine.Core.HandleError.';

const Response = require('./Response');

/**
 * @interface
 */
module.exports = class Presenter {
    static toString() { return _package + Presenter.name; }

    constructor() {
        if (new.target === Presenter) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Response} response
     */
    present(response) {
        throw 'Not implemented';
    }
};
