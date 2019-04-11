const Request = require('../src/Request');

test('stores request information', () => {
    const endpoint = 'endpoint';
    const params = {some: 'param', other: 'value'};

    const request = new Request(endpoint, params);

    expect(request.getEndpoint()).toBe(endpoint);
    expect(request.getParameter('some')).toBe(params.some);
    expect(request.getParameter('other')).toBe(params.other);
});
