const Router = require('router').Router;
const RouterException = require('router').RouterException;
const Input = require('router').Input;
const Parser = require('command-line-parser');

module.exports = class App {
    static get DEFAULT_REPRESENTATION() { return 'integrated'; }
    static get ARG_ARCHITECTURE() { return 'arc'; }

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
        // @todo: allow different representations
        const input = new Input('sloth_machine/run_program', App.DEFAULT_REPRESENTATION, {
            architecture: parser.getArgument(App.ARG_ARCHITECTURE),
            file: parser.getArgument()
        });

        this._router.route(input);
    }
};
