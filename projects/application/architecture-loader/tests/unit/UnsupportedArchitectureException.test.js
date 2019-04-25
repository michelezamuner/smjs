const UnsupportedArchitectureException = require('../../src/UnsupportedArchitectureException');

test('provides fqcn', () => {
    expect(UnsupportedArchitectureException.toString())
        .toBe('SlothMachine.ArchitectureLoader.UnsupportedArchitectureException');
});

test('contains architecture name', () => {
    const architectureName = 'architecture';
    const exception = new UnsupportedArchitectureException(architectureName);

    expect(exception.getArchitectureName()).toBe(architectureName);
});
