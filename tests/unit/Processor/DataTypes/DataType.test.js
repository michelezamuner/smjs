const DataType = require('../../../../src/Processor/DataTypes/DataType');

/**
 * @type {null|number}
 */
let random = null;

const Type = class extends DataType {
    /**
     * @returns {number}
     */
    static get MAX() {
        return 123;
    }

    /**
     * @param {number} value
     */
    constructor(value) {
        super(value);
    }
};

beforeEach(() => {
    random = Math.floor(Math.random() * Type.MAX);
});

test('cannot be instantiated', () => {
    expect(() => new DataType(random)).toThrow('Abstract class cannot be instantiated');
});

test('subclass must implement MAX constant', () => {
    const Sub = class extends DataType {
        constructor(value) {
            super(value);
        }
    };
    expect(() => new Sub(random)).toThrow('MAX constant must be implemented');
});

test('implements equals', () => {
    const t1 = new Type(random);
    const t2 = new Type(random);

    expect(t1.equals(t2)).toBe(true);

    const t3 = new Type(random + 1);

    expect(t1.equals(t3)).toBe(false);
});

test('does not accept non numbers', () => {

});

test('accepts only integers', () => {
    ['some string', 1.234, {}].forEach(value => {
        expect(() => new Type(value)).toThrow(`Data types must be constructed from positive integers, got '${value}' instead`);
    });
});

test('accepts only positive integers', () => {
    const value = -random;
    expect(() => new Type(value)).toThrow(`Data types must be constructed from positive integers, got '${value}' instead`);
});

test('fails if value out of bounds', () => {
    const random = Math.floor(Type.MAX + Math.random() * 10 + 1);
    expect(() => new Type(random)).toThrow('Value out of bounds');
});

test('support copy constructor', () => {
    const t1 = new Type(random);
    const t2 = new Type(t1);

    expect(t1.equals(t2)).toBe(true);
});

test('get integer value in twos complement', () => {
    [[5, 5], [16, 16], [61, 61], [62, -62], [63, -61], [122, -2], [123, -1]].forEach(([value, expected]) => {
        expect((new Type(value)).getSigned()).toBe(expected);
    });
});

test('get integer value unsigned', () => {
    const t = new Type(random);
    expect(t.get()).toBe(random);
});
