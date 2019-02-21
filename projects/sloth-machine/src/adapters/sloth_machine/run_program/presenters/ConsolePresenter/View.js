const ViewModel = require('./ViewModel');

/**
 * @interface
 */
module.exports = class View {
    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
