const PresenterInterface = require('virtual-machine').Presenter;
const ErrorPresenter = require('../../../../sloth_machine_core/handle_error/presenters/shared_presenter/Presenter');
const ErrorResponse = require('../../../../sloth_machine_core/handle_error/presenters/shared_presenter/Response');
const View = require('./View');
const ViewModel = require('./ViewModel');
const ExitStatus = require('domain/sloth-machine-framework').interpreter.ExitStatus;
const MissingProgramFileException = require('virtual-machine').MissingProgramReferenceException;
const UnsupportedArchitectureException = require('app/architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('app/architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

/**
 * Console presenter for the sloth_machine/run_program use case.
 *
 * Represents console output, with exit status abiding by POSIX standard, and error messages available to be displayed.
 * Primary port: virtual_machine
 * Primary adapter: sloth_machine
 * Use case: run_program
 */
module.exports = class Presenter extends PresenterInterface {
    static get __DEPS__() { return [View, ErrorPresenter]; }
    static get MIN_EXIT_STATUS() { return 0; }
    static get MAX_EXIT_STATUS() { return 255; }
    static get DEFAULT_EXIT_STATUS() { return Presenter.MAX_EXIT_STATUS; }

    /**
     * @param {View} view
     * @param {ErrorPresenter} errorPresenter
     */
    constructor(view, errorPresenter) {
        super();
        this._view = view;
        this._errorPresenter = errorPresenter;
    }

    /**
     * @override
     */
    present(response) {
        const error = response.getError();
        if (error !== null) {
            const errorResponse = new ErrorResponse(new Error(this._parseErrorMessage(error)));
            this._errorPresenter.present(errorResponse);

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
