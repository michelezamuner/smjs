const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const Word = require('../../../DataTypes/Word');

module.exports = class Jne extends Definition {
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
        if (!this._registers.getFlag(Registers.FLAG_EQ)) {
            this._registers.setIp(new Word(byte2, byte3));
        }
    }
};
