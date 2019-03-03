const Integer = require('../../../../../src/domain/sloth-machine-framework/data/Integer');
const random = require('random');

test('defaults to zero', () => {
    const integer = new Integer();

    expect(integer).toStrictEqual(new Integer(0));
});

test('supports equals', () => {
    const value = random(100);
    const first = new Integer(value);
    const second = new Integer(value);

    expect(first).toStrictEqual(second);
    expect(first.eq(second)).toBe(true);
});

test('supports copy constructor', () => {
    const first = new Integer(random(100));
    const second = new Integer(first);

    expect(first).toStrictEqual(second);
});

test('can be formatted', () => {
    const value = random(100);
    const integer = new Integer(value);

    expect(integer.format()).toBe('' + value);
});

test('supports addition', () => {
    const firstValue = random(100);
    const secondValue = random(100);
    const first = new Integer(firstValue);
    const second = new Integer(secondValue);

    expect(first.add(second)).toStrictEqual(new Integer(firstValue + secondValue));
});
