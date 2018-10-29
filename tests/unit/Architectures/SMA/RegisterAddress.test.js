const RegisterAddress = require('../../../../src/Architectures/SMA/RegisterAddress');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const Double = require('../../../../src/DataTypes/Double');
const random = require('../../random');

/**
 * @type {null|RegisterAddress[]}
 */
let addresses = null;

beforeEach(() => {
    const amount = Math.floor(Math.random() * 3) + 1;
    addresses = RegisterAddress.generate(amount).map(addr => ({
        whole: new RegisterAddress(addr.whole),
        half: new RegisterAddress(addr.half),
        leftq: new RegisterAddress(addr.leftq),
        rightq: new RegisterAddress(addr.rightq),
    }));
});

test('generates addresses as bytes', () => {
    const amount = Math.floor(Math.random() * 3) + 1;
    const addresses = RegisterAddress.generate(amount);
    for (const address of addresses) {
        expect(address.whole).toBeInstanceOf(Byte);
        expect(address.half).toBeInstanceOf(Byte);
        expect(address.leftq).toBeInstanceOf(Byte);
        expect(address.rightq).toBeInstanceOf(Byte);
    }
});

test('compares to other addresses', () => {
    for (const i in addresses) {
        expect(addresses[i].whole.eq(new RegisterAddress(i * 4 + 3))).toBe(true);
        expect(addresses[i].half.eq(new RegisterAddress(i * 4 + 2))).toBe(true);
        expect(addresses[i].leftq.eq(new RegisterAddress(i * 4 + 1))).toBe(true);
        expect(addresses[i].rightq.eq(new RegisterAddress(i * 4))).toBe(true);
    }
});

test('can print the address as hex string', () => {
    for (const i in addresses) {
        expect(addresses[i].whole.format()).toBe('0x' + (i * 4 + 3).toString(16));
        expect(addresses[i].half.format()).toBe('0x' + (i * 4 + 2).toString(16));
        expect(addresses[i].leftq.format()).toBe('0x' + (i * 4 + 1).toString(16));
        expect(addresses[i].rightq.format()).toBe('0x' + (i * 4).toString(16));
    }
});

test('provides index of the register in an array of registers', () => {
    for (const i in addresses) {
        expect(addresses[i].whole.getIndex()).toBe(parseInt(i));
        expect(addresses[i].half.getIndex()).toBe(parseInt(i));
        expect(addresses[i].leftq.getIndex()).toBe(parseInt(i));
        expect(addresses[i].rightq.getIndex()).toBe(parseInt(i));
    }
});

test('tells to which part of the register it refers to', () => {
    for (const address of addresses) {
        for (const part of ['whole', 'half', 'leftq', 'rightq']) {
            expect(address[part].isWhole()).toBe(part === 'whole');
            expect(address[part].isHalf()).toBe(part === 'half');
            expect(address[part].isLeftq()).toBe(part === 'leftq');
            expect(address[part].isRightq()).toBe(part === 'rightq');
        }
    }
});

test('can be created from bytes', () => {
    const value = new Byte(random(Byte));
    const address = new RegisterAddress(value);
    expect(address.eq(new RegisterAddress(value))).toBe(true);
    expect(address.format()).toBe(value.toString());
    expect(typeof(address.getIndex())).toBe('number');
    expect(typeof(address.isWhole())).toBe('boolean');
    expect(typeof(address.isHalf())).toBe('boolean');
    expect(typeof(address.isLeftq())).toBe('boolean');
    expect(typeof(address.isRightq())).toBe('boolean');
});

test('tells the data type of the part of the register it refers to', () => {
    for (const address of addresses) {
        expect(address.whole.getType()).toBe(Double);
        expect(address.half.getType()).toBe(Word);
        expect(address.leftq.getType()).toBe(Byte);
        expect(address.rightq.getType()).toBe(Byte);
    }
});

test('can be cast to half', () => {
    for (const address of addresses) {
        expect(address.rightq.toHalf()).toStrictEqual(address.half);
        expect(address.leftq.toHalf()).toStrictEqual(address.half);
        expect(address.half.toHalf()).toStrictEqual(address.half);
        expect(address.whole.toHalf()).toStrictEqual(address.half);
    }
});

test('can be cast to whole', () => {
    for (const address of addresses) {
        expect(address.rightq.toWhole()).toStrictEqual(address.whole);
        expect(address.leftq.toWhole()).toStrictEqual(address.whole);
        expect(address.half.toWhole()).toStrictEqual(address.whole);
        expect(address.whole.toWhole()).toStrictEqual(address.whole);
    }
});
