const ArchitectureLoader = require('../../src/ArchitectureLoader');

test('provides fqcn', () => {
    expect(ArchitectureLoader.toString()).toBe('SlothMachine.ArchitectureLoader.ArchitectureLoader');
});
