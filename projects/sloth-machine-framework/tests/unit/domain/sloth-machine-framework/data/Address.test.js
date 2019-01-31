const Address = require('../../../../../src/domain/sloth-machine-framework/data/Address');
const Integer = require('../../../../../src/domain/sloth-machine-framework/data/Integer');
const random = require('random');

test('extends integer', () => {
    const address = new Address();

    expect(address).toBeInstanceOf(Integer);
});

test('returns correct type from add', () => {
    const first = random(100);
    const second = random(100);
    expect(new Address(first).add(new Address(second))).toStrictEqual(new Address(first + second));
});
