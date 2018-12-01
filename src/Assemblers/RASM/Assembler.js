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
            case 'inc':
                return [Instruction.inc, Register[operands[0]], new Byte(0x00), new Byte(0x00)];
            case 'dec':
                return [Instruction.dec, Register[operands[0]], new Byte(0x00), new Byte(0x00)];
            case 'addi':
                return [Instruction.addi, Register[operands[0]], ...(new Word(parseInt(operands[1])).expand())];
            case 'add':
                return [Instruction.add, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'addm':
                return [Instruction.addm, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'subi':
                return [Instruction.subi, Register[operands[0]], ...(new Word(parseInt(operands[1])).expand())];
            case 'sub':
                return [Instruction.sub, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'subm':
                return [Instruction.subm, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'muli':
                return [Instruction.muli, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'mul':
                return [Instruction.mul, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'mulm':
                return [Instruction.mulm, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'cmpi':
                return [Instruction.cmpi, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'cmp':
                return [Instruction.cmp, Register[operands[0]], Register[operands[1]], new Byte(0x00)];
            case 'cmpm':
                return [Instruction.cmpm, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
            case 'jmp':
                return [Instruction.jmp, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'je':
                return [Instruction.je, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'jne':
                return [Instruction.jne, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'jg':
                return [Instruction.jg, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'jge':
                return [Instruction.jge, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'jl':
                return [Instruction.jl, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'jle':
                return [Instruction.jle, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'pushi':
                return [Instruction.pushi, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'push':
                return [Instruction.push, Register[operands[0]], new Byte(0x00), new Byte(0x00)];
            case 'pushmb':
                return [Instruction.pushmb, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'pushmw':
                return [Instruction.pushmw, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'pushmd':
                return [Instruction.pushmd, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'pop':
                return [Instruction.pop, Register[operands[0]], new Byte(0x00), new Byte(0x00)];
            case 'call':
                return [Instruction.call, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'calla':
                return [Instruction.calla, ...(new Word(parseInt(operands[0]))).expand(), new Byte(parseInt(operands[1]))];
            case 'reti':
                return [Instruction.reti, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'retr':
                return [Instruction.retr, Register[operands[0]], new Byte(0x00), new Byte(0x00)];
            case 'retmb':
                return [Instruction.retmb, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'retmw':
                return [Instruction.retmw, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
            case 'retmd':
                return [Instruction.retmd, ...(new Word(parseInt(operands[0]))).expand(), new Byte(0x00)];
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
