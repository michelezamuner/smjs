const InvalidArchitectureException = require('../../../../src/application/architecture_loader/InvalidArchitectureException');

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new InvalidArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
