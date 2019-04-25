const Data = require('../../../src/data/Data');
const DataUnit = require('../../../src/data/DataUnit');
const random = require('lib/random');

test('provides fqcn', () => {
    expect(Data.toString()).toBe('SlothMachine.SlothMachineFramework.Data.Data');
});

test('defaults to empty set', () => {
    const data = new Data();

    expect(data).toStrictEqual(new Data([]));
});

test('supports eq', () => {
    const data = [new DataUnit(random(100)), new DataUnit(random(100)), new DataUnit(random(100))];
    const first = new Data(data);
    const second = new Data(data);
    const third = new Data([]);
    const fourth = new Data([new DataUnit(101), new DataUnit(101), new DataUnit(101)]);

    expect(first).toStrictEqual(second);
    expect(first.eq(second)).toBe(true);
    expect(first.eq(third)).toBe(false);
    expect(first.eq(fourth)).toBe(false);
});

test('supports copy constructor', () => {
    const data = [new DataUnit(random(100)), new DataUnit(random(100)), new DataUnit(random(100))];
    const first = new Data(data);
    const second = new Data(first);

    expect(first).toStrictEqual(second);
});

test('can be converted to data units array', () => {
    const data = [new DataUnit(random(100)), new DataUnit(random(100)), new DataUnit(random(100))];

    expect(new Data(data).toArray()).toBe(data);
});
