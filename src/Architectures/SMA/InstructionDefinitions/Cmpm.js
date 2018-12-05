const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Word = require('../../../DataTypes/Word');

module.exports = class Cmpm extends Definition {
    /**
     * @inheritDoc
     */
    static getDependencies() {
        return [Registers, Memory];
    }

    /**
     * @param {Registers} registers
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        super();
        this._registers = registers;
        this._memory = memory;
    }

    /**
     * @inheritDoc
     */
    exec(byte2, byte3, byte4) {
        const registerAddress = new RegisterAddress(byte2);
        const type = registerAddress.getType();
        const left = this._registers.get(registerAddress);
        const right = new type(...this._memory.readSet(new Word(byte3, byte4), type.SIZE));
        this._registers.setFlag(Registers.FLAG_EQ, left.eq(right));
        this._registers.setFlag(Registers.FLAG_LT, left.lt(right));
        this._registers.setFlag(Registers.FLAG_GT, left.gt(right));
    }
};
