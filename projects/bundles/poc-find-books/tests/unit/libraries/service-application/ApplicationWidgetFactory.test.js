const ApplicationWidgetFactory = require('../../../../src/libraries/service-application/ApplicationWidgetFactory');
const InputParser = require('../../../../src/libraries/service-application/input-parser/InputParser');
const WidgetAdapters = require('../../../../src/libraries/service-application/widgets/WidgetAdapters');
const ApplicationWidget = require('../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');

class StubApplicationWidget extends ApplicationWidget {
    /**
     * @param {ApplicationWidgetDeps} deps
     */
    constructor(deps) {
        super(deps);
    }

    /**
     * @return {Connection}
     */
    getConnection() {
        return this._connection;
    }

    /**
     * @return {InputParser}
     */
    getParser() {
        return this._parser;
    }

    /**
     * @return {WidgetAdapters}
     */
    getAdapters() {
        return this._adapters;
    }
}

test('can be injected', () => {
    expect(ApplicationWidgetFactory.__DEPS__).toStrictEqual([ InputParser, WidgetAdapters ]);
});

test('provides fqcn', () => {
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.ApplicationWidgetFactory');
});

test('creates application widget of the given class', () => {
    const parser = {};
    const adapters = {};
    const connection = {};
    const factory = new ApplicationWidgetFactory(parser, adapters);

    const widget = factory.create(StubApplicationWidget, connection);

    expect(widget).toBeInstanceOf(StubApplicationWidget);
    expect(widget.getConnection()).toBe(connection);
    expect(widget.getParser()).toBe(parser);
    expect(widget.getAdapters()).toBe(adapters);
});
