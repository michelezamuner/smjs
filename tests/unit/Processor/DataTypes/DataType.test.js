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
    random = Math.floor(Math.random() * 10);
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

test('accepts only integers in constructor', () => {
    ['some string', 1.234, {}].forEach(value => {
        expect(() => new Type(value)).toThrow(`Data types must be constructed from integers, got '${value}' instead`);
    });
});

test('support copy constructor', () => {
    const t1 = new Type(random);
    const t2 = new Type(t1);

    expect(t1.equals(t2)).toBe(true);
});

test('fails if value out of bounds', () => {
    const random = Math.floor(Type.MAX + Math.random() * 10 + 1);
    expect(() => new Type(random)).toThrow('Value out of bounds');
    expect(() => new Type(-random)).toThrow('Value out of bounds');
});

test('casts to integer', () => {
    const t = new Type(random);

    expect(t.toInt()).toBe(random);
});
