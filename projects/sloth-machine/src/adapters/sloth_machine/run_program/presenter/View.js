const ViewModel = require('./ViewModel');

module.exports = class View {
    static get ERROR_EXIT_STATUS() { return 127; }

    /**
     * @param {ViewModel} viewModel
     */
    render(viewModel) {
        throw 'Not implemented';
    }
};
