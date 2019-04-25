const InvalidArchitectureException = require('../../src/InvalidArchitectureException');

test('provides fqcn', () => {
    expect(InvalidArchitectureException.toString())
        .toBe('SlothMachine.ArchitectureLoader.InvalidArchitectureException');
});

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new InvalidArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
