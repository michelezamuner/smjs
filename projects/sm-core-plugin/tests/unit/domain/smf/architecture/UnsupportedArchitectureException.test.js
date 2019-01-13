const UnsupportedArchitectureException = require('../../../../../src/domain/smf/architecture/UnsupportedArchitectureException');

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new UnsupportedArchitectureException(architectureName);

    expect(exception.getArchitecture()).toBe(architectureName);
});
