const Input = require('../src/Input');

test('stores input information', () => {
    const identifier = 'identifier';
    const representation = 'representation';
    const params = {some: 'param', other: 'value'};

    const input = new Input(identifier, representation, params);

    expect(input.getIdentifier()).toBe(identifier);
    expect(input.getRepresentation()).toBe(representation);
    expect(input.getParameter('some')).toBe(params.some);
    expect(input.getParameter('other')).toBe(params.other);
});
