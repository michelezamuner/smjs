const Definition = require('../InstructionSet/Definition');
const Registers = require('../Registers');
const RegisterAddress = require('../RegisterAddress');

module.exports = class Cmp extends Definition {
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
        if (leftAddress.getType() !== rightAddress.getType()) {
            throw new Error(`Type mismatch: cannot compare register ${leftAddress} to register ${rightAddress}`);
        }
        const left = this._registers.get(leftAddress);
        const right = this._registers.get(rightAddress);
        this._registers.setFlag(Registers.FLAG_EQ, left.eq(right));
        this._registers.setFlag(Registers.FLAG_LT, left.lt(right));
        this._registers.setFlag(Registers.FLAG_GT, left.gt(right));
    }
};
