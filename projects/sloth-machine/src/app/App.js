const Router = require('router').Router;
const RouterException = require('router').RouterException;
const Input = require('router').Input;
const Parser = require('command-line-parser');

module.exports = class App {
    static get DEFAULT_REPRESENTATION() { return 'integrated'; }
    static get ARG_ARCHITECTURE() { return 'arc'; }
    static get __DEPS__() { return [ Router ]; }

    /**
     * @param {Router} router
     */
    constructor(router) {
        this._router = router;
    }

    /**
     * @param {Parser} parser
     * @throws {RouterException}
     */
    run(parser) {
        try {
            // @todo: allow different representations
            const input = new Input('sloth_machine/run_program', App.DEFAULT_REPRESENTATION, {
                architecture: parser.getArgument(App.ARG_ARCHITECTURE),
                file: parser.getArgument()
            });

            this._router.route(input);
        } catch (e) {
            this._handleError(e);
        }
    }

    /**
     * @param {*} e
     * @private
     */
    _handleError(e) {
        const input = new Input('console_application/handle_error', 'error', {error: e instanceof Error ? e : new Error(e)});
        try {
            this._router.route(input);
        } catch (e) {
            // prevent infinite recursion
            // @todo: log this instead of crashing the app
            throw e;
        }
    }
};
