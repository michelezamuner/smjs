const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

const Type = class extends DataType {
    static get SIZE() {
        return 2;
    }
    constructor(value) {
        super(value);
    }
};

const OtherType = class extends DataType {
    static get SIZE() {
        return 2;
    }
    constructor(value) {
        super(value);
    }
};

test('cannot be instantiated', () => {
    expect(() => new DataType(random)).toThrow('Abstract class cannot be instantiated');
});

test('implements equals', () => {
    const value = random(Type, 1);
    const t1 = new Type(value);
    const t2 = new Type(value);

    expect(t1.eq(t2)).toBe(true);

    const t3 = new Type(value - 1);

    expect(t1.eq(t3)).toBe(false);
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
    const value = 2 ** (8 * Type.SIZE);
    expect(() => new Type(value)).toThrow(`Value out of bounds for Type: ${value}`);
});

test('support copy constructor', () => {
    const t1 = new Type(random(Type));
    const t2 = new Type(t1);

    expect(t1.eq(t2)).toBe(true);
});

test('get integer value unsigned', () => {
    const value = random(Type);
    const t = new Type(value);
    expect(t.uint()).toBe(value);
});

test('get integer value in twos complement', () => {
    [[5, 5], [16, 16], [32767, 32767], [32768, -32768], [32769, -32767], [65534, -2], [65535, -1]].forEach(([value, expected]) => {
        expect((new Type(value)).int()).toBe(expected);
    });
});

test('expand to list of unit data types', () => {
    const size = 2 ** Math.floor(Math.random() * 3);
    class TypeToExpand extends DataType {
        static get SIZE() {
            return size;
        }
        static get UNIT_TYPE() {
            return TypeToExpand;
        }
        constructor(value) {
            super(value);
        }
    }

    const value = new TypeToExpand(random(TypeToExpand));
    const units = value.expand();
    let expected = 0;
    let index = 0;
    for (const unit of units.reverse()) {
        expected += unit.uint() * (2 ** (8 * index++));
    }
    expect(value.uint()).toBe(expected);
});

test('adds another data type', () => {
    const second = random(OtherType);
    const first = random(Type, 0, second);
    const result = (new Type(first)).add(new OtherType(second));
    expect(result).toStrictEqual(new Type(first + second));
});

test('compares data types', () => {
    const first = random(Type);
    const second = random(OtherType);
    const lt = (new Type(first)).lt(new OtherType(second));
    const ltoe = (new Type(first)).ltoe(new OtherType(second));
    const gt = (new Type(first)).gt(new OtherType(second));
    const gtoe = (new Type(first)).gtoe(new OtherType(second));
    expect(lt).toBe(first < second);
    expect(ltoe).toBe(first <= second);
    expect((new Type(first)).ltoe(new Type(first))).toBe(true);
    expect(gt).toBe(first > second);
    expect(gtoe).toBe(first >= second);
    expect((new Type(first)).gtoe(new Type(first))).toBe(true);
});
