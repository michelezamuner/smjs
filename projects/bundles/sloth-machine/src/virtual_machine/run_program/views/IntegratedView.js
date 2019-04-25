const _package = 'SlothMachine.SlothMachine.VirtualMachine.RunProgram.Views.';

const View = require('../presenters/console_presenter/View');
const Console = require('console-wrapper').Console;

module.exports = class IntegratedView extends View {
    static get __DEPS__() { return [Console]; }
    static toString() { return _package + IntegratedView.name; }

    /**
     * @param {Console} console
     */
    constructor(console) {
        super();
        this._console = console;
    }

    /**
     * @override
     */
    render(viewModel) {
        this._console.exit(viewModel.getExitStatus());
    }
};
