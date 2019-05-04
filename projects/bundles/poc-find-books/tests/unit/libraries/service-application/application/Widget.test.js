const Widget = require('../../../../../src/libraries/service-application/application/Widget');

test('provides fqcn', () => {
    expect(Widget.toString()).toBe('FindBooks.ServiceApplication.Application.Widget');
});

test('must override connect', () => {
    const widget = new Widget();
    expect(() => widget.connect()).toThrow('Not implemented');
});
