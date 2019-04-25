const DataUnit = require('../../../src/data/DataUnit');
const random = require('lib/random');

test('provides fqcn', () => {
    expect(DataUnit.toString()).toBe('SlothMachine.SlothMachineFramework.Data.DataUnit');
});

test('supports equals', () => {
    const value = random(100);
    const first = new DataUnit(value);
    const second = new DataUnit(value);

    expect(first).toStrictEqual(second);
    expect(first.eq(second)).toBe(true);
});

test('can be formatted to string', () => {
    const value = random(100);
    const unit = new DataUnit(value);

    expect(unit.format()).toBe('' + value);
});
