const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

const Type = class extends DataType {
    /**
     * @inheritDoc
     */
    static get SIZE() {
        return 2;
    }

    /**
     * @param {number} value
     */
    constructor(value) {
        super(value);
    }

    /**
     * @inheritDoc
     */
    toSignedInt() {
        return super.constructor._toSignedInt(this.constructor.SIZE, this._value);
    }
};

test('cannot be instantiated', () => {
    expect(() => new DataType(random)).toThrow('Abstract class cannot be instantiated');
});

test('subclass must implement SIZE constant', () => {
    const Sub = class extends DataType {
        constructor(value) {
            super(value);
        }
    };
    expect(() => new Sub(random(Sub))).toThrow('Not implemented');
});

test('implements equals', () => {
    const value = random(Type, 1);
    const t1 = new Type(value);
    const t2 = new Type(value);

    expect(t1.equals(t2)).toBe(true);

    const t3 = new Type(value - 1);

    expect(t1.equals(t3)).toBe(false);
});

test('accepts only integers', () => {
    ['some string', 1.234, {}].forEach(value => {
        expect(() => new Type(value)).toThrow(`Data types must be constructed from positive integers, got '${value}' instead`);
    });
});

test('accepts only positive integers', () => {
    const value = -random(Type, 1);
    expect(() => new Type(value)).toThrow(`Data types must be constructed from positive integers, got '${value}' instead`);
});

test('fails if value out of bounds', () => {
    expect(() => new Type(2 ** (8 ** Type.SIZE))).toThrow('Value out of bounds');
});

test('support copy constructor', () => {
    const t1 = new Type(random(Type));
    const t2 = new Type(t1);

    expect(t1.equals(t2)).toBe(true);
});

test('get integer value in twos complement', () => {
    [[5, 5], [16, 16], [32767, 32767], [32768, -32768], [32769, -32767], [65534, -2], [65535, -1]].forEach(([value, expected]) => {
        expect((new Type(value)).toSignedInt()).toBe(expected);
    });
});

test('fails to cast to signed int if method is not implemented', () => {
    const Sub = class extends DataType {
        /**
         * @inheritDoc
         */
        static get SIZE() {
            return 2;
        }

        /**
         * @param {number} value
         */
        constructor(value) {
            super(value);
        }
    };

    expect(() => (new Sub(random(Sub))).toSignedInt()).toThrow('Not implemented');
});

test('get integer value unsigned', () => {
    const value = random(Type);
    const t = new Type(value);
    expect(t.toInt()).toBe(value);
});
