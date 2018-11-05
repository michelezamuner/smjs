const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Word = require('../../../DataTypes/Word');

module.exports = class Jmp extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers];
    }

    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        super();
        this._registers = registers;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        this._registers.setIp(new Word(byte2, byte3));
    }
};
