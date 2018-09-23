const Byte = require('../../../../src/Processor/DataTypes/Byte');

test('implements equals', () => {
    const code = Math.floor(Math.random() * 10);
    const b1 = new Byte(code);
    const b2 = new Byte(code);

    expect(b1.equals(b2)).toBe(true);

    const otherCode = Math.floor(Math.random() * 100);
    const b3 = new Byte(otherCode);

    expect(b1.equals(b3)).toBe(false);
});

test('equals matches strings and numbers', () => {
    const code = Math.floor(Math.random() * 10);
    const b1 = new Byte(code);
    const b2 = new Byte('' + code);

    expect(b1.equals(b2)).toBe(true);
});

test('supports copy constructor', () => {
    const code = Math.floor(Math.random() * 10);
    const b1 = new Byte(code);
    const b2 = new Byte(b1);

    expect(b1.equals(b2)).toBe(true);
});

test('casts to integer', () => {
    const code = Math.floor(Math.random() * 10);
    const b = new Byte(code);

    expect(b.toInt()).toBe(code);
});
