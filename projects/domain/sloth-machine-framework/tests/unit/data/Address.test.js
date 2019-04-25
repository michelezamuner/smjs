const Address = require('../../../src/data/Address');
const Integer = require('../../../src/data/Integer');
const random = require('lib/random');

test('provides fqcn', () => {
    expect(Address.toString()).toBe('SlothMachine.SlothMachineFramework.Data.Address');
});

test('extends integer', () => {
    const address = new Address();

    expect(address).toBeInstanceOf(Integer);
});

test('returns correct type from add', () => {
    const first = random(100);
    const second = random(100);

    expect(new Address(first).add(new Address(second))).toStrictEqual(new Address(first + second));
});
