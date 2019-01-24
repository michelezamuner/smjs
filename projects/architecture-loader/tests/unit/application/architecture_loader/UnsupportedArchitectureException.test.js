const UnsupportedArchitectureException = require('../../../../src/application/architecture_loader/UnsupportedArchitectureException');

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new UnsupportedArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
