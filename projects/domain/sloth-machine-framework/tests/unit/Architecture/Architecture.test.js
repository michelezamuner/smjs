const Architecture = require('../../../src/architecture/Architecture');

test('provides fqcn', () => {
    expect(Architecture.toString()).toBe('SlothMachine.SlothMachineFramework.Architecture.Architecture');
});
