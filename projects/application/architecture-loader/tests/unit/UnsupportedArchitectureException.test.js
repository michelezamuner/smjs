const UnsupportedArchitectureException = require('../../src/UnsupportedArchitectureException');

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new UnsupportedArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
