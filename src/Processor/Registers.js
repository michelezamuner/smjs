const Byte = require('./DataTypes/Byte');

/**
 * Set of registers for a processor.
 */
module.exports = class Registers {
    /**
     * @returns {Byte}
     */
    static get EXIT_TRIGGER_OFF() {
        return new Byte(0);
    }

    /**
     * @returns {Byte}
     */
    static get EXIT_TRIGGER_ON() {
        return new Byte(1);
    }

    /**
     * @returns {Byte}
     */
    static get EXIT_STATUS_OK() {
        return new Byte(0);
    }
    /**
     * @returns {string}
     */
    static get REG_EAX() {
        return 'eax';
    }

    /**
     * @returns {string}
     */
    static get REG_EBX() {
        return 'ebx';
    }

    /**
     * @returns {string}
     */
    static get REG_ECX() {
        return 'ecx';
    }

    /**
     * @returns {string}
     */
    static get REG_EDX() {
        return 'edx';
    }

    /**
     * @returns {string[]}
     */
    static get MAIN_REGISTERS() {
        return [Registers.REG_EAX, Registers.REG_EBX, Registers.REG_ECX, Registers.REG_EDX];
    }

    constructor()
    {
        Registers.MAIN_REGISTERS.forEach(register => {
            this[`_${register}`] = new Byte(0);
        });

        this._ip = 0;
    }

    /**
     * @returns {Byte}
     */
    get et() {
        return this._et;
    }

    /**
     * @param {Byte} et
     */
    set et(et) {
        if (!(et instanceof Byte)) {
            throw `Exit trigger register must be set to byte, got ${et} instead`;
        }
        this._et = et;
    }

    /**
     * @returns {Byte}
     */
    get es() {
        return this._es;
    }

    /**
     * @param {Byte} es
     */
    set es(es) {
        if (!(es instanceof Byte)) {
            throw `Exit status register must be set to byte, got ${es} instead`;
        }
        this._es = es;
    }

    /**
     * @param {string} register
     * @param {number|Byte} value
     */
    setMain(register, value) {
        if (!Registers.MAIN_REGISTERS.includes(register)) {
            throw `Invalid main register '${register}'`;
        }

        this[`_${register}`] = new Byte(value);
    }

    /**
     * @param {string} register
     * @returns {Byte}
     */
    getMain(register) {
        if (!Registers.MAIN_REGISTERS.includes(register)) {
            throw `Invalid main register '${register}'`;
        }

        return this[`_${register}`];
    }

    /**
     * @returns {number}
     */
    get ip() {
        return this._ip;
    }

    /**
     * @param {number|string} ip
     */
    set ip(ip) {
        const ipVal = parseInt(ip);

        if (isNaN(ipVal) || ipVal < 0) {
            throw `Invalid instruction pointer ${ip}`;
        }
        this._ip = ipVal;
    }
};
