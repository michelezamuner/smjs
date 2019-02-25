const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class View {
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
