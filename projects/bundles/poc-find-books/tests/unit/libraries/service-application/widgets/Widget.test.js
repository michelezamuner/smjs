const Widget = require('../../../../../src/libraries/service-application/widgets/Widget');

/**
 * @type {Object[]}
 */
const children = [
    { name: 'child1', widget: new Widget() },
    { name: 'child2', widget: new Widget() },
];

/**
 * @type {null|Widget}
 */
let widget = null;

beforeEach(() => {
    widget = new Widget();
    for (const child of children) {
        child.widget.connect = jest.fn();
        widget.addWidget(child.name, child.widget);
    }
});

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Widgets.Widget');
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