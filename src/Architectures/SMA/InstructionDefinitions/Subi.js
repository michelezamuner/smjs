const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Word = require('../../../DataTypes/Word');
const Byte = require('../../../DataTypes/Byte');

module.exports = class Subi extends Definition {
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
        const address = new RegisterAddress(byte2);
        const left = this._registers.get(address);
        const right = address.getType() === Byte ? new Byte(byte4) : new Word(byte3, byte4);
        this._registers.set(address, left.sub(right));
    }
};
