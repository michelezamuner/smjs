const Memory = require('../ProcessorArchitecture/Memory');
const Mnemonics = require('./Mnemonics');
const Registers = require('./Registers');
const Byte = require('../DataTypes/Byte');
const Word = require('../DataTypes/Word');

/**
 * Source code parser.
 *
 * @todo Should be injected only with an interface providing registers addresses, it doesn't need to have access to all
 * registers functionality.
 */
module.exports = class Parser {
    /**
     * @param {Registers} registers
     * @param {Memory} memory
     */
    constructor(registers, memory) {
        this._registers = registers;
        this._memory = memory;
    }
    /**
     * Parse the given source code to produce executable instructions, and load them into memory.
     *
     * @param {string} code
     */
    parse(code) {
        const bytes = code.split("\n")
            .map(line => line.trim())
            .filter(this._isNotEmptyLine)
            .filter(this._isNotCommentLine)
            .reduce((bytes, instruction) => [...bytes, ...this._parseInstruction(instruction)], [])
        ;

        for (const address in bytes) {
            this._memory.write(new Word(parseInt(address)), bytes[address]);
        }
    }

    /**
     * @param {string} line
     * @returns {boolean}
     * @private
     */
    _isNotEmptyLine(line) {
        return line !== '';
    }

    /**
     * @param {string} line
     * @returns {boolean}
     * @private
     */
    _isNotCommentLine(line) {
        return line.indexOf(';') !== 0;
    }

    /**
     * @param {string} line
     * @returns {object}
     * @private
     */
    _parseInstruction(line) {
        const commentDelimiter = line.indexOf(';');
        if (commentDelimiter !== -1) {
            line = line.substring(0, commentDelimiter).trim();
        }

        const opcodeDelimiter = line.indexOf(' ');
        if (opcodeDelimiter === -1) {
            return [new Byte(Mnemonics[line]), new Byte(0), new Byte(0), new Byte(0)];
        }

        const operands = line.substring(opcodeDelimiter + 1).split(',').map(operand => operand.trim());

        return [
            this._parseOpcode(line.substring(0, opcodeDelimiter), operands),
            this._parseOperand(operands[0]),
            this._parseOperand(operands[1]),
            new Byte(0x00),
        ];
    }

    /**
     * @param {string} opcode
     * @param {[string, string]}operands
     * @returns {Byte}
     * @private
     */
    _parseOpcode(opcode, operands) {
        switch (opcode) {
            case 'mov':
                if (Number.isInteger(parseInt(operands[1]))) {
                    return Mnemonics.movi;
                }

                return Mnemonics.mov;
        }
    }

    /**
     * @param {string} operand
     * @returns {Byte}
     * @private
     */
    _parseOperand(operand) {
        if (Mnemonics[operand]) {
            return Mnemonics[operand];
        }

        if (this._registers[operand]) {
            return this._registers[operand];
        }

        return new Byte(parseInt(operand));
    }
};
