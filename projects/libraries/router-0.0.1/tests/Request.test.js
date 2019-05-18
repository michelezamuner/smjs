const Request = require('../src/Request');

test('provides fqcn', () => {
    expect(Request.toString()).toBe('Router.Request');
});

test('provides request data', () => {
    const path = 'path';
    const params = { param: 'param' };
    const meta = { meta: 'meta' };

    const request = new Request(path, params, meta);

    expect(request.getPath()).toBe(path);
    expect(request.getParam('param')).toBe(params.param);
    expect(request.getMeta('meta')).toBe(meta.meta);
});

test('returns null for non existing data', () => {
    const request = new Request('', {}, {});

    expect(request.getParam('param')).toBe(null);
    expect(request.getMeta('meta')).toBe(null);
});
