const Stack = require('../../../../src/Architectures/SMA/Stack');
const Byte = require('../../../../src/DataTypes/Byte');
const Word = require('../../../../src/DataTypes/Word');
const Double = require('../../../../src/DataTypes/Double');
const random = require('../../random');

/**
 * @type {Object}
 */
const memory = {};

/**
 * @type {Word}
 */
const memoryMax = random(Word);

/**
 * @type {Word}
 */
const stackSize = new Word(Math.floor(Math.random() * (parseInt(memoryMax) - 2)));

/**
 * @type {null|Stack}
 */
let stack = null;

beforeEach(() => {
    memory.getMax = () => memoryMax;
    stack = new Stack(memory, stackSize);
});

test('can push any type', () => {
    let stackPointer = memoryMax;
    for (const type of [Byte, Word, Double]) {
        memory.write = jest.fn();
        const value = random(type);
        const bytes = value.expand();

        stack.push(value);
        for (let i = 0; i < parseInt(type.SIZE); i++) {
            expect(memory.write.mock.calls[i][0]).toStrictEqual(stackPointer.sub(new Word(i + 1)));
            expect(memory.write.mock.calls[i][1]).toStrictEqual(bytes[i]);
        }

        stackPointer = stackPointer.sub(type.SIZE);
    }
});

test('can pop value of given type', () => {
    let address = memoryMax;
    for (const type of [Byte, Word, Double]) {
        memory.write = () => null;
        const value = random(type);

        stack.push(value);

        address = address.sub(type.SIZE);
        // Values are stored in the stack with the stack pointer pointing to the LSB
        memory.read = (addr, size) =>
            addr.eq(address) && size.eq(type.SIZE) ? value.expand().reverse() : null;

        const result = stack.pop(type);
        address = address.add(type.SIZE);

        expect(result).toStrictEqual(value);
    }
});

test('can push new frames', () => {
    // Initialize stack pointers
    const stackBottom = memoryMax;
    let stackPointer = stackBottom;
    let basePointer = stackBottom;

    const framesCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < framesCount; i++) {
        memory.write = jest.fn();
        const returnAddress = random(Word);
        stack.pushFrame(returnAddress);

        // Push the current base pointer
        expect(memory.write.mock.calls[0][0]).toStrictEqual(stackPointer.sub(new Word(1)));
        expect(memory.write.mock.calls[0][1]).toStrictEqual(basePointer.expand()[0]);
        expect(memory.write.mock.calls[1][0]).toStrictEqual(stackPointer.sub(new Word(2)));
        expect(memory.write.mock.calls[1][1]).toStrictEqual(basePointer.expand()[1]);

        stackPointer = stackPointer.sub(new Word(2));

        // Push the given return address
        expect(memory.write.mock.calls[2][0]).toStrictEqual(stackPointer.sub(new Word(1)));
        expect(memory.write.mock.calls[2][1]).toStrictEqual(returnAddress.expand()[0]);
        expect(memory.write.mock.calls[3][0]).toStrictEqual(stackPointer.sub(new Word(2)));
        expect(memory.write.mock.calls[3][1]).toStrictEqual(returnAddress.expand()[1]);

        stackPointer = stackPointer.sub(new Word(2));

        // As last step of pushing a frame, the base pointer is moved to the new value of the stack pointer
        basePointer = stackPointer;

        // Work a bit with the stack
        stack.push(random(Byte));
        stack.push(random(Word));
        stack.push(random(Double));

        // Update the stack pointer to sync with the last stack manipulation
        stackPointer = stackPointer.sub(new Word(7));
    }
});

test('can pop frames', () => {
    // Initialize stack pointers
    const stackBottom = memoryMax;
    let stackPointer = stackBottom;
    let basePointer = stackBottom;

    const returnAddresses = [];
    const mockMemory = {};

    const framesCount = Math.floor(Math.random() * 5);

    for (let i = 0; i < framesCount; i++) {
        memory.write = () => null;

        // Push frame
        const returnAddress = random(Word);
        returnAddresses[i] = returnAddress;
        stack.pushFrame(returnAddress);
        stackPointer = stackPointer.sub(new Word(4));

        // Store return address and old base pointer
        mockMemory[stackPointer] = returnAddress.expand();
        mockMemory[stackPointer.add(Word.SIZE)] = basePointer.expand();

        // Update new base pointer
        basePointer = stackPointer;

        // Work a bit with the stack
        stack.push(random(Byte));
        stack.push(random(Word));
        stack.push(random(Double));
        stackPointer = stackPointer.sub(Byte.SIZE.add(Word.SIZE).add(Double.SIZE));
    }

    // Mock memory
    // Values are stored in the stack with the stack pointer pointing to the LSB
    memory.read = (addr, size) =>
        (addr in mockMemory) && size.eq(Word.SIZE) ? mockMemory[addr].reverse() : null;

    for (let i = framesCount - 1; i >= 0; i--) {
        // Pop frame
        const result = stack.popFrame();
        expect(result).toStrictEqual(returnAddresses[i]);

        // Work a bit with the stack
        stack.push(random(Byte));
        stack.push(random(Word));
        stack.push(random(Double));
    }
});

test('fails when underflow', () => {
    memory.write = () => null;
    memory.read = () => [];

    stack.push(random(Word));
    stack.push(random(Byte));
    stack.pop(Byte);
    stack.pop(Word);

    expect(() => stack.pop(Byte)).toThrow(new Error('Stack underflow'));

    stack.push(random(Byte));

    expect(() => stack.pop(Word)).toThrow(new Error('Stack underflow'));
    expect(() => stack.pop(Double)).toThrow(new Error('Stack underflow'));
});

test('fails with underflow because of data type exception', () => {
    memory.getMax = () => new Word(65535);
    const stack = new Stack(memory, random(Word));

    stack.push(random(Byte));

    expect(() => stack.pop(Word)).toThrow(new Error('Stack underflow'));
});

test('fails when overflow', () => {
    memory.write = () => null;
    memory.read = () => [];

    for (let i = 0; i < parseInt(stackSize) - 1; i++) {
        stack.push(random(Byte));
    }

    expect(() => stack.push(random(Double))).toThrow(new Error('Stack overflow'));
    expect(() => stack.push(random(Word))).toThrow(new Error('Stack overflow'));

    stack.push(random(Byte));
    expect(() => stack.push(random(Byte))).toThrow(new Error('Stack overflow'));
});

test('fails with overflow because of data type exception', () => {
    memory.getMax = () => new Word(1);
    memory.write = () => null;
    const stack = new Stack(memory, new Word(1));

    stack.push(random(Byte));

    expect(() => stack.push(random(Byte))).toThrow(new Error('Stack overflow'));
    expect(() => stack.push(random(Word))).toThrow(new Error('Stack overflow'));
    expect(() => stack.push(random(Double))).toThrow(new Error('Stack overflow'));
});
