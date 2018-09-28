const Mnemonics = require('../../src/Interpreter/Mnemonics');
const Registers = require('../../src/Interpreter/Registers');
const Byte = require('../../src/Processor/DataTypes/Byte');

/**
 * Source code parser.
 *
 * @todo Should be injected only with an interface providing registers addresses, it doesn't need to have access to all
 * registers functionality.
 */
module.exports = class Parser {
    /**
     * @param {Registers} registers
     */
    constructor(registers) {
        this._registers = registers;
    }
    /**
     * Parse the given source code to produce executable instructions.
     *
     * @param {string} code
     * @return {array}
     */
    parse(code) {
        return code.split("\n")
            .map(line => line.trim())
            .filter(this._isNotEmptyLine)
            .filter(this._isNotCommentLine)
            .reduce((bytes, instruction) => [...bytes, ...this._parseInstruction(instruction)], [])
        ;
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
