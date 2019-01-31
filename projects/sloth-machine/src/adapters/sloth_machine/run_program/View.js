const ViewModel = require('./ViewModel');

module.exports = class View {
    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
