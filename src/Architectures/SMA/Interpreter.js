const InterpreterInterface = require('../../ProcessorInterfaces/Interpreter');
const Byte = require('../../DataTypes/Byte');

/**
 * @implements InterpreterInterface
 */
module.exports = class Interpreter extends InterpreterInterface {
    /**
     * @param {InstructionSet} instructionSet
     * @param {object} opcodeMap
     */
    constructor(instructionSet, opcodeMap) {
        super();
        this._instructionSet = instructionSet;
        this._opcodeMap = opcodeMap;
    }

    /**
     * @inheritDoc
     */
    getInstructionSize() {
        return new Byte(4);
    }

    /**
     * @inheritDoc
     */
    exec([byte1, byte2, byte3, byte4]) {
        const instructionName = Object.keys(this._opcodeMap)
            .find(instructionName => this._opcodeMap[instructionName].eq(byte1));
        const instruction = this._instructionSet.get(instructionName);
        instruction.exec(byte2, byte3, byte4);
    }
};
