const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class View {
    static get ERROR_EXIT_STATUS() { return 127; }

    constructor() {
        if (new.target === View) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
