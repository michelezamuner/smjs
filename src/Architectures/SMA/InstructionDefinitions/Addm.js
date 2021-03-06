const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');
const Memory = require('../../../ProcessorInterfaces/Memory');
const Word = require('../../../DataTypes/Word');

module.exports = class Addm extends Definition {
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
        const address = new RegisterAddress(byte2);
        const mem = new Word(byte3, byte4);
        const left = this._registers.get(address);
        const type = address.getType();
        const right = new type(...this._memory.read(mem, type.SIZE));
        this._registers.set(address, left.add(right));
    }
};
