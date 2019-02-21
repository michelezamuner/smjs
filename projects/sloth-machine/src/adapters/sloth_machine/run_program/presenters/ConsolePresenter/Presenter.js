const PresenterInterface = require('virtual-machine').Presenter;
const View = require('./View');
const ViewModel = require('./ViewModel');
const ErrorView = require('./ErrorView');
const ErrorViewModel = require('./ErrorViewModel');
const Response = require('virtual-machine').Response;
const ExitStatus = require('sloth-machine-framework').ExitStatus;
const MissingProgramFileException = require('virtual-machine').MissingProgramReferenceException;
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

/**
 * Console presenter for run_program use case.
 *
 * Represents console output, with exit status abiding by POSIX standard, and error messages available to be displayed.
 * Primary port: virtual_machine
 * Primary adapter: sloth_machine
 * Use case: run_program
 */
module.exports = class Presenter extends PresenterInterface {
    static get __DEPS__() { return [View, ErrorView]; }
    static get MIN_EXIT_STATUS() { return 0; }
    static get MAX_EXIT_STATUS() { return 255; }
    static get DEFAULT_EXIT_STATUS() { return Presenter.MAX_EXIT_STATUS; }

    constructor(view, errorView) {
        super();
        this._view = view;
        this._errorView = errorView;
    }

    /**
     * @param {Response} response
     */
    present(response) {
        const error = response.getError();
        if (error !== null) {
            const viewModel = new ErrorViewModel(this._parseErrorMessage(error));
            this._errorView.render(viewModel);

            return;
        }

        const viewModel = new ViewModel(this._parseExitStatus(response.getExitStatus()));
        this._view.render(viewModel);
    }

    /**
     * @param {ExitStatus} exitStatus
     * @return {number}
     * @private
     */
    _parseExitStatus(exitStatus) {
        const value = parseInt(exitStatus.format());
        if (value < Presenter.MIN_EXIT_STATUS || value > Presenter.MAX_EXIT_STATUS) {
            return Presenter.DEFAULT_EXIT_STATUS;
        }

        return value;
    }

    /**
     * @param {Error} error
     * @return {string}
     * @private
     */
    _parseErrorMessage(error) {
        if (error instanceof MissingProgramFileException) {
            return 'No program file given';
        }
        if (error instanceof UnsupportedArchitectureException) {
            return `Cannot find selected architecture "${error.getArchitectureName()}"`
        }
        if (error instanceof InvalidArchitectureException) {
            return `Selected architecture "${error.getArchitectureName()}" has invalid implementation`;
        }
        if (error instanceof InvalidProgramException) {
            return `Invalid program file given: ${error.message}`
        }

        return error.message;
    }
};
