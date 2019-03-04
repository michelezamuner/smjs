const InvalidArchitectureException = require('../../src/InvalidArchitectureException');

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new InvalidArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
