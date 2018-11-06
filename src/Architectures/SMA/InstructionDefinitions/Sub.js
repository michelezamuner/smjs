const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');

module.exports = class Sub extends Definition {
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
        const leftAddress = new RegisterAddress(byte2);
        const rightAddress = new RegisterAddress(byte3);
        const left = this._registers.get(leftAddress);
        const right = this._registers.get(rightAddress);
        this._registers.set(leftAddress, left.sub(right));
    }
};
