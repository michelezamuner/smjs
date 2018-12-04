const DataType = require('../../../src/DataTypes/DataType');
const random = require('../random');

const Type = createDataType(2);

test('cannot be instantiated', () => {
    expect(() => new DataType(0x00)).toThrow(new Error('Abstract class cannot be instantiated'));
});

test('implements equals', () => {
    const value = parseInt(random(Type, 1));
    const t1 = new Type(value);
    const t2 = new Type(value);

    expect(t1.eq(t2)).toBe(true);

    const t3 = new Type(value - 1);

    expect(t1.eq(t3)).toBe(false);
});

test('accepts only integers', () => {
    ['some string', 1.234, {}].forEach(value => {
        expect(() => new Type(value)).toThrow(new Error(`Data types must be constructed from positive integers, got '${value}' instead`));
    });
});

test('accepts only positive integers', () => {
    const value = -parseInt(random(Type, 1));
    expect(() => new Type(value)).toThrow(new Error(`Data types must be constructed from positive integers, got '${value}' instead`));
});

test('fails if value out of bounds', () => {
    const value = 2 ** (8 * Type.SIZE);
    expect(() => new Type(value)).toThrow(new Error(`Value out of bounds for type of size ${Type.SIZE}: ${value}`));
});

test('support copy constructor', () => {
    const t1 = random(Type);
    const t2 = new Type(t1);

    expect(t1.eq(t2)).toBe(true);
});

test('supports clone', () => {
    const value = random(Type);

    expect(value.clone()).toStrictEqual(value);
    expect(value.clone()).not.toBe(value);
});

test('implements to string', () => {
    const value = parseInt(random(Type));
    const type = new Type(value);
    expect(`${type}`).toBe('0x' + value.toString(16));
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

    const value = random(TypeToExpand);
    const units = value.expand();
    let expected = 0;
    let index = 0;
    for (const unit of units.reverse()) {
        expected += parseInt(unit) * (2 ** (8 * index++));
    }
    expect(parseInt(value)).toBe(expected);
});

test('cast to a equal or bigger data type', () => {
    const Smaller = createDataType(1);
    const Bigger = createDataType(2);

    const value = random(Smaller);

    expect(value.cast(Smaller)).toBeInstanceOf(Smaller);
    expect(value.cast(Smaller).eq(value)).toBe(true);
    expect(value.cast(Bigger)).toBeInstanceOf(Bigger);
    expect(value.cast(Bigger).eq(value)).toBe(true);
});

test('cannot cast to a smaller data type', () => {
    const Smaller = createDataType(1);
    const Bigger = createDataType(2);

    const value = random(Bigger);

    expect(() => value.cast(Smaller))
        .toThrow(new Error(`Cannot cast data type of size ${Bigger.SIZE} to data type of size ${Smaller.SIZE}`));
});

test('cast to a bigger data type', () => {
    const Smaller = createDataType(1);
    const Bigger = createDataType(2);
    const smallerValue = random(Smaller);
    const biggerValue = smallerValue.cast(Bigger);
    expect(smallerValue.eq(biggerValue)).toBe(true);
});

test('can be incremented', () => {
    const value = parseInt(random(Type, 0, 1));
    const result = (new Type(value)).inc();
    expect(result).toStrictEqual(new Type(value + 1));
});

test('can be decremented', () => {
    const value = parseInt(random(Type, 1));
    const result = (new Type(value)).dec();
    expect(result).toStrictEqual(new Type(value - 1));
});

test('adds another data type', () => {
    const OtherType = createDataType(2);
    const second = random(OtherType);
    const first = random(Type, 0, parseInt(second));
    const result = first.add(second);
    expect(result).toStrictEqual(new Type(parseInt(first) + parseInt(second)));
});

test('subtracts another data type', () => {
    const OtherType = createDataType(2);
    const second = random(OtherType);
    const first = random(Type, parseInt(second));
    const result = first.sub(second);
    expect(result).toStrictEqual(new Type(parseInt(first) - parseInt(second)));
});

test('compares data types', () => {
    const OtherType = createDataType(2);
    const first = random(Type);
    const second = random(OtherType);
    const lt = first.lt(second);
    const ltoe = first.ltoe(second);
    const gt = first.gt(second);
    const gtoe = first.gtoe(second);
    expect(lt).toBe(parseInt(first) < parseInt(second));
    expect(ltoe).toBe(parseInt(first) <= parseInt(second));
    expect(first.ltoe(first)).toBe(true);
    expect(gt).toBe(parseInt(first) > parseInt(second));
    expect(gtoe).toBe(parseInt(first) >= parseInt(second));
    expect(first.gtoe(first)).toBe(true);
});

test('multiplies to same type', () => {
    const couples = [
        [0x4E03, 0xA166, 0x312E, 0xF832],
        [0x03A3, 0xFE91, 0x039D, 0xC953],
        [0x56B4, 0xAA27, 0x39A0, 0xBD6C],
        [0xB612, 0x21C8, 0x1806, 0x9010],
    ];
    for (const couple of couples) {
        const result = (new Type(couple[0])).mul(new Type(couple[1]));
        expect(result).toStrictEqual([new Type(couple[2]), new Type(couple[3])]);
    }
});

test('fails if not multiplying for same sized type', () => {
    const Smaller = createDataType(1);
    const Larger = createDataType(2);
    expect(() => random(Smaller).mul(random(Larger)))
        .toThrow(new Error('Type mismatch: cannot multiply types of different sizes'));
});

/**
 * @param {number} size
 * @return {function}
 */
function createDataType(size) {
    return class extends DataType {
        static get SIZE() {
            return size;
        }
        constructor(value) {
            super(value);
        }
    };
}
