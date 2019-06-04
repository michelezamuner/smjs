const ApplicationWidgetFactory = require('../../../../src/libraries/service-application/ApplicationWidgetFactory');
const InputParser = require('../../../../src/libraries/service-application/input-parser/InputParser');
const WidgetAdapterFactory = require('../../../../src/libraries/service-application/widgets/WidgetAdapterFactory');
const ApplicationWidget = require('../../../../src/libraries/service-application/widgets/ApplicationWidget');
const ApplicationWidgetDeps = require('../../../../src/libraries/service-application/widgets/ApplicationWidgetDeps');
const Config = require('../../../../src/libraries/service-application/Config');

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
     * @return {WidgetAdapterFactory}
     */
    getAdapterFactory() {
        return this._adapterFactory;
    }
}

test('can be injected', () => {
    expect(ApplicationWidgetFactory.__DEPS__).toStrictEqual([ InputParser, WidgetAdapterFactory, Config ]);
});

test('provides fqcn', () => {
    expect(ApplicationWidgetFactory.toString()).toBe('FindBooks.ServiceApplication.ApplicationWidgetFactory');
});

test('creates application widget of the given class', () => {
    const parser = {};
    const adapterFactory = {};
    const config = { getApplicationWidgetClass: () => StubApplicationWidget };
    const connection = {};
    const factory = new ApplicationWidgetFactory(parser, adapterFactory, config);

    const widget = factory.create(connection);

    expect(widget).toBeInstanceOf(StubApplicationWidget);
    expect(widget.getConnection()).toBe(connection);
    expect(widget.getParser()).toBe(parser);
    expect(widget.getAdapterFactory()).toBe(adapterFactory);
});
