const Memory = require('../../../src/Memory/Memory');
const MemoryInterface = require('../../../src/ProcessorInterfaces/Memory');
const Byte = require('../../../src/DataTypes/Byte');
const Word = require('../../../src/DataTypes/Word');
const Double = require('../../../src/DataTypes/Double');
const random = require('../random');

/**
 * @type {null|Memory}
 */
let memory = null;

/**
 * @type {Word}
 */
const max = new Word(0xFFFF);

beforeEach(() => {
    memory = new Memory(max);
});

test('implements memory interface', () => {
    expect(memory).toBeInstanceOf(MemoryInterface);
});

test('has max', () => {
    expect(memory.getMax()).toStrictEqual(max);
});

test('reads zeros wherever nothing has been written', () => {
    for (const address of [0x0000, 0x1234, 0xFEDC]) {
        const size = random(Word, 0, address);
        const bytes = [];
        for (let i = 0; i < parseInt(size); i++) {
            bytes.push(new Byte());
        }
        expect(memory.read(new Word(address), size)).toStrictEqual(bytes);
    }
});

test('reads and writes data types', () => {
    for (const type of [Byte, Word, Double]) {
        const address = random(Word);
        const value = random(type);

        memory.write(address, value);
        expect(new type(...memory.read(address, type.SIZE))).toStrictEqual(value);
    }
});

test('reads and writes arrays of bytes', () => {
    const address = random(Word);
    const size = random(Byte);
    const bytes = [];
    for (let i = 0; i < parseInt(size); i++) {
        bytes.push(random(Byte));
    }

    memory.write(address, bytes);
    expect(memory.read(address, size)).toStrictEqual(bytes);
});

test('fails if trying to read outside of memory size', () => {
    const maxDouble = max.cast(Double);
    expect(() => memory.read(maxDouble, new Byte(0x02)))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.read(maxDouble.dec(), new Byte(0x03)))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.read(maxDouble.inc(), new Byte(0x01)))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
});

test('fails if reading empty size', () => {
    expect(() => memory.read(new Byte(0x00), new Byte(0x00))).toThrow('Size of memory to read cannot be zero');
});

test('fails if trying to write over memory max', () => {
    const maxDouble = max.cast(Double);
    expect(() => memory.write(maxDouble.inc(), new Byte()))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.write(maxDouble, new Word()))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.write(maxDouble, [new Byte(), new Byte()]))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.write(maxDouble.dec(), [new Byte(), new Byte(), new Byte()]))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
    expect(() => memory.write(maxDouble.dec(), new Double()))
        .toThrow(`Address ${maxDouble.inc()} exceeds memory max (${max})`);
});
