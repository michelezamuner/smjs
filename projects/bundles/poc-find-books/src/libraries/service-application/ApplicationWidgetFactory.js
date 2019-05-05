const _package = 'FindBooks.ServiceApplication.';

const InputParser = require('./input-parser/InputParser');
const MessageBus = require('message-bus').MessageBus;
const ApplicationWidgetDeps = require('./widgets/ApplicationWidgetDeps');
const Connection = require('./server/Connection');

module.exports = class ApplicationWidgetFactory {
    static get __DEPS__() { return [ InputParser ]; }
    static toString() { return _package + ApplicationWidgetFactory.name; }

    /**
     * @param {InputParser} parser
     */
    constructor(parser) {
        this._parser = parser;
    }

    /**
     * @param {Function} applicationWidgetClass
     * @param {{name: {string}, type: {Function}, args: {array}}[]} widgets
     * @param {Connection} connection
     * @return {Application}
     */
    create(applicationWidgetClass, widgets, connection) {
        const deps = new ApplicationWidgetDeps(new MessageBus(), connection, this._parser);

        return new applicationWidgetClass(deps);
    }
};
