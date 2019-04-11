const Input = require('../src/Input');

test('stores input information', () => {
    const identifier = 'identifier';
    const params = {some: 'param', other: 'value'};

    const input = new Input(identifier, params);

    expect(input.getIdentifier()).toBe(identifier);
    expect(input.getParameter('some')).toBe(params.some);
    expect(input.getParameter('other')).toBe(params.other);
});
