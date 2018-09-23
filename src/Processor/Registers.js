const Byte = require('./DataTypes/Byte');

/**
 * Set of registers for a processor.
 */
module.exports = class Registers {
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
     * @returns {string}
     */
    static get REG_ESC() {
        return 'esc';
    }

    /**
     * @returns {string[]}
     */
    static get MAIN_REGISTERS() {
        return [Registers.REG_EAX, Registers.REG_EBX, Registers.REG_ECX, Registers.REG_EDX];
    }

    /**
     * @returns {string[]}
     */
    static get STATUS_REGISTERS() {
        return [Registers.REG_ESC];
    }

    constructor()
    {
        Registers.MAIN_REGISTERS.forEach(register => {
            this[`_${register}`] = new Byte(undefined);
        });

        this._ip = 0;
    }

    /**
     * @param {string} register
     * @param {string|number|Byte} value
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

    /**
     * @param {string} register
     * @param {number|string|Byte} value
     */
    setStatus(register, value) {
        if (!Registers.STATUS_REGISTERS.includes(register)) {
            throw `Invalid status register '${register}'`;
        }

        if (value instanceof Byte) {
            value = value.toInt();
        }

        const parsedValue = typeof value === 'string' ? parseFloat(value) : value;
        if (!Number.isInteger(parsedValue)) {
            throw `Status register must be integer, got '${value}' instead`;
        }

        this[`_${register}`] = parsedValue;
    }

    /**
     * @param {string} register
     * @returns {number}
     */
    getStatus(register) {
        if (!Registers.STATUS_REGISTERS.includes(register)) {
            throw `Invalid status register '${register}'`;
        }

        return this[`_${register}`];
    }
};
