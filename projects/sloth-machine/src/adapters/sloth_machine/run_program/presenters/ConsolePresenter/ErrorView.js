const ErrorViewModel = require('./ErrorViewModel');

/**
 * @interface
 */
module.exports = class ErrorView {
    /**
     * @param {ErrorViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
