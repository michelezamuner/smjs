const PresenterInterface = require('virtual-machine').Presenter;
const View = require('./View');
const Response = require('virtual-machine').Response;
const SuccessResponse = require('virtual-machine').SuccessResponse;
const ErrorResponse = require('virtual-machine').ErrorResponse;
const MissingProgramFileException = require('virtual-machine').MissingProgramReferenceException;
const ViewModel = require('./ViewModel');
const UnsupportedArchitectureException = require('architecture-loader').UnsupportedArchitectureException;
const InvalidArchitectureException = require('architecture-loader').InvalidArchitectureException;
const InvalidProgramException = require('program-loader').InvalidProgramException;

/**
 * Presenter for run_program: translates response data using application-specific format into output data using
 * adapter-specific format.
 *
 * Primary port: virtual_machine
 * Primary adapter: sloth_machine
 * Use case: run_program
 */
module.exports = class Presenter extends PresenterInterface {
    static get __DEPS__() { return [View]; }

    /**
     * @param {View} view
     */
    constructor(view) {
        super();
        this._view = view;
    }

    /**
     * @param {Response} response
     */
    present(response) {
        if (response instanceof SuccessResponse) {
            this._view.render(new ViewModel(parseInt(response.getExitStatus().format())));
        }
        if (response instanceof ErrorResponse) {
            this._view.render(this._getErrorViewModel(response.getError()));
        }
    }

    /**
     * @param {Error} error
     * @return {ViewModel}
     * @private
     */
    _getErrorViewModel(error) {
        if (error instanceof MissingProgramFileException) {
            return new ViewModel(null, 'No program file given');
        }
        if (error instanceof UnsupportedArchitectureException) {
            return new ViewModel(null, `Cannot find selected architecture "${error.getArchitectureName()}"`);
        }
        if (error instanceof InvalidArchitectureException) {
            return new ViewModel(null, `Selected architecture "${error.getArchitectureName()}" has invalid implementation`);
        }
        if (error instanceof InvalidProgramException) {
            return new ViewModel(null, `Invalid program file given: ${error.message}`);
        }

        return new ViewModel(null, error.message);
    }
};
