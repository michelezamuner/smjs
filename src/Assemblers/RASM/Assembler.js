const Register = require('../../Architectures/SMA/Mnemonics').register;
const Instruction = require('../../Architectures/SMA/Mnemonics').instruction;
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');

module.exports = class Assembler {
    /**
     * @param {string} code
     * @returns {Byte[]}
     */
    assemble(code) {
        let lines = code.split("\n");
        lines = this._removeBlanks(lines);
        lines = this._removeComments(lines);

        return lines.reduce((bytes, line) => [...bytes, ...this._parseLine(line)], []);
    }

    /**
     * @param {string[]} lines
     * @returns {string[]}
     * @private
     */
    _removeBlanks(lines) {
        return lines
            .map(line => line.trim())
            .filter(line => line !== '');
    }

    /**
     * @param {string[]} lines
     * @returns {string[]}
     * @private
     */
    _removeComments(lines) {
        return lines
            .filter(line => !line.startsWith(';'))
            .map(line => {
                const commentStart = line.indexOf(';');
                return commentStart !== -1 ? line.substring(0, commentStart).trim() : line;
            });
    }

    /**
     * @param {string} line
     * @return {[Byte, Byte, Byte, Byte]}
     * @private
     */
    _parseLine(line) {
        if (line.startsWith('0x')) {
            return this._parseBytes(line);
        }

        const opcodeEnd = line.indexOf(' ');
        if (opcodeEnd === -1) {
            return [new Byte(Instruction[line]), new Byte(0x00), new Byte(0x00), new Byte(0x00)];
        }

        const opcode = line.substring(0, opcodeEnd);
        const operands = line.substring(opcodeEnd + 1).split(',').map(operand => operand.trim());
        switch (opcode) {
            case 'mov':
                return [Instruction.mov, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'movi':
                return [Instruction.movi, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'movim':
                return [Instruction.movim, ...(new Word(parseInt(operands[0]))).expand(), new Byte(parseInt(operands[1]))];
            case 'movipb':
                return [Instruction.movipb, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'movipw':
                return [Instruction.movipw, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'movipd':
                return [Instruction.movipd, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'movimp':
                return [Instruction.movimp, ...(new Word(parseInt(operands[0]))).expand(), new Byte(parseInt(operands[1]))];
            case 'movm':
                return [Instruction.movm, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'movp':
                return [Instruction.movp, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'movrm':
                return [Instruction.movrm, ...(new Word(parseInt(operands[0]))).expand(), Register[operands[1]]];
            case 'movrp':
                return [Instruction.movrp, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'movrmp':
                return [Instruction.movrmp, ...(new Word(parseInt(operands[0]))).expand(), Register[operands[1]]];
            case 'muli':
                return [Instruction.muli, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'mul':
                return [Instruction.mul, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
        }

        throw new Error(`Invalid opcode: ${opcode}`);
    }

    /**
     * @param {string} line
     * @returns {Byte[]}
     * @private
     */
    _parseBytes(line) {
        const bytes = [];
        let start = line.indexOf('0x');
        while (start !== -1) {
            const next = line.indexOf('0x', start + 1);
            const value = next === -1 ? line.substring(start) : line.substring(start, next);
            bytes.push(new Byte(parseInt(value)));
            start = next;
        }

        return bytes;
    }
};
