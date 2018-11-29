const Memory = require('../../ProcessorInterfaces/Memory');
const DataType = require('../../DataTypes/DataType');
const Word = require('../../DataTypes/Word');
const Byte = require('../../DataTypes/Byte');

/**
 * The Stack encapsulates all details regarding implementing a call stack within the main memory, and it's meant
 * to be used by instructions to perform their operations.
 *
 * Despite still relying on the concept of Stack Pointer and Base Pointer, these are not stored externally, but only as
 * implementation details of Stack, with the intent of preventing manual manipulation of them: all stack operations can
 * thus be done only by using the stack abstractions, which are push, pop, push frame and pop frame.
 *
 * The stack is oriented from the top of the available memory, growing downwards; any data type can be pushed on the
 * stack, and the stack pointer always points to the least significant byte of the last pushed value.
 *
 * For this reason, when the stack is empty the stack pointer doesn't point to any value: to represent this, the stack
 * pointer is assigned a value that is equal to the maximum usable address, plus one. Since we need to increment the
 * maximum usable address, we cannot use the maximum value addressable by the memory, because it could also be the
 * maximum value that can be represented by the data type, meaning that it won't be possible to be incremented: for this
 * reason, the maximum usable address is one less than the maximum of the memory, and when the stack is empty, the stack
 * pointer points to the maximum address of the memory.
 *
 * @type {Stack}
 */
module.exports = class Stack {
    /**
     * @param {Memory} memory
     * @param {Word} stackSize
     */
    constructor(memory, stackSize) {
        this._memory = memory;
        this._stackBottom = this._memory.getMax();
        this._stackTop = this._stackBottom.sub(stackSize);
        this._stackPointer = this._stackBottom;
        this._basePointer = this._stackBottom;
    }

    /**
     * Push the given value to the top of the stack.
     *
     * If some of the bytes of the value would go over the maximum allowed top of the stack, a stack overflow error is
     * thrown.
     *
     * @param {DataType} value
     * @throws {Error}
     */
    push(value) {
        const newStackPointer = this._advanceStackPointer(value.constructor.SIZE);
        if (this._stackPointer.eq(this._stackTop) || newStackPointer.lt(this._stackTop)) {
            throw new Error('Stack overflow');
        }
        this._stackPointer = newStackPointer;

        const bytes = value.expand();
        for (let i = 0; i < value.constructor.SIZE; i++) {
            this._memory.write(this._stackPointer.add(new Word(i)), bytes[i]);
        }
    }

    /**
     * Pop a value of the given data type off of the stack.
     *
     * If some bytes are requested to be taken from below the bottom of the stack, a stack underflow error is thrown.
     *
     * @param {function} type
     * @return {DataType}
     * @throws {Error}
     */
    pop(type) {
        const newStackPointer = this._regressStackPointer(type.SIZE);

        if (this._stackPointer.eq(this._stackBottom) || newStackPointer.gt(this._stackBottom)) {
            throw new Error('Stack underflow');
        }

        const value = new type(...this._memory.readSet(this._stackPointer, new Byte(type.SIZE)));
        this._stackPointer = newStackPointer;

        return value;
    }

    /**
     * Push a new frame to the top of the stack, storing the given return address.
     *
     * @param {Word} returnAddress
     * @throws {Error}
     */
    pushFrame(returnAddress) {
        this.push(this._basePointer);
        this.push(returnAddress);
        this._basePointer = this._stackPointer;
    }

    /**
     * Pop the top frame from the stack, returning the return address that was stored with that frame.
     *
     * @return {Word}
     * @throws {Error}
     */
    popFrame() {
        this._stackPointer = this._basePointer;
        const returnAddress = this.pop(Word);
        this._basePointer = this.pop(Word);

        return returnAddress;
    }

    /**
     * @param {number} size
     * @return {Word}
     * @private
     */
    _advanceStackPointer(size) {
        try {
            return this._stackPointer.sub(new Word(size));
        } catch (e) {
            throw 'Stack overflow';
        }
    }

    /**
     * @param {number} size
     * @return {Word}
     * @private
     */
    _regressStackPointer(size) {
        try {
            return this._stackPointer.add(new Word(size));
        } catch (e) {
            throw 'Stack underflow';
        }
    }
};
