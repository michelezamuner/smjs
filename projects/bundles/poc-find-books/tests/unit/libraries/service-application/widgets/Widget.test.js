const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Widgets.Widget');
});

test('provides bus', () => {
    const bus = {};
    class StubWidget extends Widget {
        constructor(busArg) {
            super(busArg);
            expect(this._bus).toBe(bus);
        }
    }

    new StubWidget(bus);

    expect.assertions(1);
});

test('connects children widgets', () => {
    const widget = new Widget();
    const widgets = [
        { name: 'w1', widget: { connect: jest.fn() }},
        { name: 'w2', widget: { connect: jest.fn() }},
    ];

    widgets.forEach(w => widget.addWidget(w.name, w.widget));

    widget.connect();

    widgets.forEach(w => expect(w.widget.connect).toBeCalled());
});

test('provides children widget', () => {
    const widget = new Widget();
    const widgets = [
        { name: 'w1', widget: { connect: jest.fn() }},
        { name: 'w2', widget: { connect: jest.fn() }},
    ];

    widgets.forEach(w => widget.addWidget(w.name, w.widget));
    widgets.forEach(w => expect(widget.getWidget(w.name)).toBe(w.widget));
});
