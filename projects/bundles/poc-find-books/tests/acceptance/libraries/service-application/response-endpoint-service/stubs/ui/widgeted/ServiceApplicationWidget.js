const ApplicationWidget = require('../../../../../../../../src/libraries/service-application/widgets/ApplicationWidget');
const Container = require('container').Container;
const MessageBus = require('message-bus').MessageBus;
const Connection = require('../../../../../../../../src/libraries/service-application/server/Connection');
const InputParser = require('../../../../../../../../src/libraries/service-application/input-parser/InputParser');
const SearchBooksWidget = require('./SearchBooksWidget');

module.exports = class ServiceApplicationWidget extends ApplicationWidget {
    static get __DEPS__() { return [ Container, MessageBus, Connection, InputParser ]; }

    /**
     * @param {Container} container
     * @param {MessageBus} bus
     * @param {Connection} connection
     * @param {InputParser} parser
     */
    constructor(container, bus, connection, parser) {
        super(bus, connection, parser);

        const widget = new SearchBooksWidget(container, bus, { endpoint: process.env.SM_ENDPOINT });
        this.addWidget('search-books', widget);
    }
};