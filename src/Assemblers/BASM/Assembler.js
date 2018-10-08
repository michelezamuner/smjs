const Mnemonics = require('../../Architectures/SMA/Mnemonics');
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');

/**
 * Source code assembler.
 */
module.exports = class Assembler {
    constructor() {
        this._variables = [];
    }

    /**
     * Assemble the given source code to produce executable instructions.
     *
     * @param {string} code
     * @return {Byte[]}
     */
    assemble(code) {
        let lines = code.split("\n");
        lines = this._removeBlanks(lines);
        lines = this._removeComments(lines);

        const dataSegment = this._parseSegment('data', lines);
        const textSegment = this._parseSegment('text', lines);

        this._variables = this._parseVariables(dataSegment);

        let object = this._parseTextBytes(textSegment);
        object = this._updateAddressesInInstructions(object);
        object = this._appendVariablesValues(object);

        return object;
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
     * @param {string} segment
     * @param {string[]} lines
     * @returns {string[]}
     * @private
     */
    _parseSegment(segment, lines) {
        let insideSegment = false;
        return lines.filter(line => {
            if (line.startsWith('.')) {
                insideSegment = false;
            }
            if (line.startsWith('.' + segment)) {
                insideSegment = true;
            }
            return insideSegment && !line.startsWith('.' + segment);
        });
    }

    /**
     * @param {string[]} dataSegment
     * @return {Object[]}
     * @private
     */
    _parseVariables(dataSegment) {
        const variables = [];
        for (const line of dataSegment) {
            const parts = line.split(/\s+/);
            if (parts[1] === 'db') {
                variables.push({name: parts[0], bytes: [new Byte(parseInt(parts[2]))]});
            } else if (parts[1] === 'dw') {
                variables.push({name: parts[0], bytes: (new Word(parseInt(parts[2]))).expand()});
            }
        }

        return variables;
    }

    /**
     * @param {string[]} textSegment
     * @returns {Byte[]}
     * @private
     */
    _parseTextBytes(textSegment) {
        return textSegment
            .reduce((bytes, line) => [...bytes, ...this._parseInstruction(line)], []);
    }

    /**
     * @param {Byte[]} object
     * @returns {Byte[]}
     * @private
     */
    _updateAddressesInInstructions(object) {
        const textSize = object.length;
        for (let i = 0; i < textSize; i += 4) {
            if (!object[i].eq(Mnemonics.movm)) {
                continue;
            }

            const relativeAddress = (new Word(object[i + 2], object[i + 3]));
            const absoluteAddress = relativeAddress.add(new Word(textSize));
            const bytes = absoluteAddress.expand();
            object[i + 2] = bytes[0];
            object[i + 3] = bytes[1];
        }

        return object;
    }

    /**
     * @param {Byte[]} object
     * @returns {Byte[]}
     * @private
     */
    _appendVariablesValues(object) {
        for (const variable of this._variables) {
            for (const byte of variable.bytes) {
                object.push(byte);
            }
        }

        return object;
    }

    /**
     * @param {string} line
     * @returns {object}
     * @private
     */
    _parseInstruction(line) {
        const opcodeDelimiter = line.indexOf(' ');
        if (opcodeDelimiter === -1) {
            return [new Byte(Mnemonics[line]), new Byte(0x00), new Byte(0x00), new Byte(0x00)];
        }

        const opcode = line.substring(0, opcodeDelimiter);
        const operands = line.substring(opcodeDelimiter + 1);
        switch (opcode) {
            case 'mov':
                return this._parseMov(operands.split(',').map(operand => operand.trim()));
        }

        return [];
    }

    /**
     * @param {[String, String]} operands
     * @return {Byte[]}
     * @private
     */
    _parseMov(operands) {
        if (Number.isInteger(parseInt(operands[1]))) {
            return [Mnemonics.movi, Mnemonics[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
        }

        if (Mnemonics[operands[1]] !== undefined) {
            return [Mnemonics.mov, Mnemonics[operands[0]], Mnemonics[operands[1]], new Byte(0x00)];
        }

        const opcode = Mnemonics.movm;
        const address = this._variables.findIndex(variable => variable.name === operands[1]);
        return [opcode, Mnemonics[operands[0]], ...(new Word(address).expand())];
    }
};
