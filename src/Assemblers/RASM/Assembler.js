const Mnemonics = require('../../Architectures/SMA/Mnemonics');
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

    _parseLine(line) {
        if (line.startsWith('0x')) {
            return this._parseBytes(line);
        }

        const opcodeEnd = line.indexOf(' ');
        if (opcodeEnd === -1) {
            return [new Byte(Mnemonics[line]), new Byte(0x00), new Byte(0x00), new Byte(0x00)];
        }

        const opcode = line.substring(0, opcodeEnd);
        const operands = line.substring(opcodeEnd + 1).split(',').map(operand => operand.trim());
        switch (opcode) {
            case 'mov':
                return [Mnemonics.mov, Mnemonics[operands[0]], Mnemonics[operands[1]], new Byte(0x00)];
            case 'movi':
                return [Mnemonics.movi, Mnemonics[operands[0]], new Byte(parseInt(operands[1])), new Byte(0x00)];
            case 'movmb':
                return [Mnemonics.movmb, Mnemonics[operands[0]], ...(new Word(parseInt(operands[1]))).toBytes()];
            case 'movmw':
                return [Mnemonics.movmw, Mnemonics[operands[0]], ...(new Word(parseInt(operands[1]))).toBytes()];
            case 'movmr':
                return [Mnemonics.movmr, ...(new Word(parseInt(operands[0]))).toBytes(), Mnemonics[operands[1]]];
        }

        return [];
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
