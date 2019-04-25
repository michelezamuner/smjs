const Size = require('../../../src/data/Size');
const Integer = require('../../../src/data/Integer');

test('provides fqcn', () => {
    expect(Size.toString()).toBe('SlothMachine.SlothMachineFramework.Data.Size');
});

test('is integer', () => {
    const size = new Size();

    expect(size).toBeInstanceOf(Integer);
});
