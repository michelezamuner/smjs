const Data = require('../../../../../src/domain/sloth-machine-framework/data/Data');
const DataUnit = require('../../../../../src/domain/sloth-machine-framework/data/DataUnit');
const random = require('lib/random');

test('defaults to empty set', () => {
    const data = new Data();

    expect(data).toStrictEqual(new Data([]));
});

test('supports eq', () => {
    const data = [new DataUnit(random(100)), new DataUnit(random(100)), new DataUnit(random(100))];
    const first = new Data(data);
    const second = new Data(data);

    expect(first).toStrictEqual(second);
    expect(first.eq(second)).toBe(true);
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
