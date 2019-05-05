const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');
const MessageBus = require('message-bus').MessageBus;

class StubWidget extends Widget {
    /**
     * @param {MessageBus} bus
     */
    constructor(bus) {
        super(bus);
    }

    /**
     * @override
     */
    addWidget(name, type, params) {
        this._widgets.set(name, params.widget);
    }

    /**
     * @return {MessageBus}
     */
    getBus() {
        return this._bus;
    }
}

/**
 * @type {Object|MessageBus}
 */
const bus = {};

/**
 * @type {null|StubWidget}
 */
let widget = null;

/**
 * @type {Object[]}
 */
const children = [
    { name: 'w1', widget: { connect: jest.fn() } },
    { name: 'w2', widget: { connect: jest.fn() } },
];

beforeEach(() => {
    widget = new StubWidget(bus);
    for (const child of children) {
        widget.addWidget(child.name, null, child);
    }
});

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Widgets.Widget');
});

test('provides bus', () => {
    expect(widget.getBus()).toBe(bus);
});

test('must implement add widget', () => {
    expect(() => new Widget().addWidget()).toThrow('Not implemented');
});

test('provides children widgets', () => {
    for (const child of children) {
        expect(widget.getWidget(child.name)).toBe(child.widget);
    }
});

test('connects children widgets', () => {
    widget.connect();

    for (const child of children) {
        expect(child.widget.connect).toBeCalled();
    }
});
