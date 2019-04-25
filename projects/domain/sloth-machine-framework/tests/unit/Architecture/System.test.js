const System = require('../../../src/architecture/System');

test('provides fqcn', () => {
    expect(System.toString()).toBe('SlothMachine.SlothMachineFramework.Architecture.System');
});
