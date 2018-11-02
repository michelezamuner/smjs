const Register = require('../../Architectures/SMA/Mnemonics').register;
const Instruction = require('../../Architectures/SMA/Mnemonics').instruction;
const Byte = require('../../DataTypes/Byte');
const Word = require('../../DataTypes/Word');
const Double = require('../../DataTypes/Double');

/**
 * Source code assembler.
 */
module.exports = class Assembler {
    /**
     * @return {number}
     * @private
     */
    static get _INSTRUCTION_SIZE() {
        return 4;
    }

    /**
     * @return {{db: Byte, dw: Word, dd: Double}}
     * @private
     */
    static get _SYMBOL_DEFINES() {
        return {db: Byte, dw: Word, dd: Double};
    }

    constructor() {
        this._symbols = [];
        this._pointers = [];
    }

    /**
     * Assemble the given source code to produce executable instructions.
     *
     * @param {string} code
     * @return {Byte[]}
     */
    assemble(code) {
        const lines = this._parseLines(code);
        const dataSegment = this._parseSegment('data', lines);
        const bssSegment = this._parseSegment('bss', lines);
        const textSegment = this._parseSegment('text', lines);
        const textSize = textSegment.length * this.constructor._INSTRUCTION_SIZE;

        this._loadSymbols(textSize, dataSegment, bssSegment);

        let object = this._parseTextBytes(textSegment);
        object = this._appendStaticData(object);

        return object;
    }

    /**
     * @param {string} code
     * @return {string[]}
     * @private
     */
    _parseLines(code) {
        let lines = code.split("\n");
        lines = this._removeBlanks(lines);
        lines = this._removeComments(lines);

        return lines;
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
     * @param {number} textSize
     * @param {string[]} dataSegment
     * @param {string[]} bssSegment
     * @private
     */
    _loadSymbols(textSize, dataSegment, bssSegment) {
        let address = new Word(textSize);
        for (const line of dataSegment) {
            const parts = this._parseDefinition(line);
            const type = this.constructor._SYMBOL_DEFINES[parts[1]];
            const size = parts.length - 2;
            let bytes = [];
            for (let i = 0; i < size; i++) {
                bytes = [...bytes, ...(new type(this._parseImmediate(parts[i + 2]))).expand()];
            }
            this._symbols.push({
                name: parts[0],
                address: address,
                type: type,
                bytes: bytes,
            });
            address = address.add(new Byte(type.SIZE * size));
        }
        for (const line of bssSegment) {
            const parts = line.split(/\s+/);
            const type = this.constructor._SYMBOL_DEFINES[parts[1]];
            const size = parts[2] === 'times' ? parseInt(parts[3]) : 1;
            this._symbols.push({
                name: parts[0],
                address: address,
                type: type,
            });
            address = address.add(new Byte(type.SIZE * size));
        }
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
    _appendStaticData(object) {
        for (const symbol of this._symbols) {
            if (symbol.bytes === undefined) {
                continue;
            }
            for (const byte of symbol.bytes) {
                object.push(byte);
            }
        }

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
     * @param {string} line
     * @return {string[]}
     * @private
     */
    _parseDefinition(line) {
        const parts = [];

        const matches = /^([^\s]+)\s+([^\s]+)\s*(.*)/.exec(line);
        parts.push(matches[1]);
        parts.push(matches[2]);

        if (matches.length === 3) {
            return parts;
        }

        let insideString = false;
        let insideChar = false;
        let part = [];
        for (const char of matches[3]) {
            if (char === '"' && !insideChar) {
                insideString = !insideString;
                continue;
            }
            if (char === "'" && !insideString) {
                insideChar = !insideChar;
                continue;
            }
            if (insideString || insideChar) {
                parts.push(`'${char}'`);
                continue;
            }
            if (char.match(/\s/) && !insideString && !insideChar) {
                if (part.length !== 0) {
                    parts.push(part.join(''));
                    part = [];
                }
                continue;
            }
            part.push(char);
        }

        if (part.length !== 0) {
            parts.push(part.join(''));
        }

        return parts;
    }

    /**
     * @param {string} line
     * @returns {object}
     * @private
     */
    _parseInstruction(line) {
        const opcodeDelimiter = line.indexOf(' ');
        if (opcodeDelimiter === -1) {
            return [new Byte(Instruction[line]), new Byte(0x00), new Byte(0x00), new Byte(0x00)];
        }

        const opcode = line.substring(0, opcodeDelimiter);
        const operands = line.substring(opcodeDelimiter + 1).split(',').map(operand => operand.trim());
        const method = `_parse${opcode.charAt(0).toUpperCase() + opcode.slice(1)}`;
        if (this[method] === undefined) {
            throw new Error(`Invalid opcode: ${opcode}`);
        }

        return this[method](operands);
    }

    /**
     * @param {[String, String]} operands
     * @return {[Byte, Byte, Byte, Byte]}
     * @private
     */
    _parseMov(operands) {
        const registerFirst = Register[operands[0]];
        const registerSecond = Register[operands[1]];
        const immediate = this._parseImmediate(operands[1]);
        const symbolFirst = this._parseSymbol(operands[0]);
        const symbolSecond = this._parseSymbol(operands[1]);
        const pointerFirst = this._parsePointer(operands[0]);
        const pointerSecond = this._parsePointer(operands[1]);
        const registerPointerFirst = Register[pointerFirst];
        const registerPointerSecond = Register[pointerSecond];
        const symbolPointerFirst = this._parseSymbol(pointerFirst);
        const symbolPointerSecond = this._parseSymbol(pointerSecond);
        const tableFirst = this._parseTable(operands[0]);
        const tableSecond = this._parseTable(operands[1]);

        if (registerFirst && registerSecond) {
            return [Instruction.mov, registerFirst, registerSecond, new Byte(0x00)];
        }

        if (registerFirst && immediate !== undefined) {
            return [Instruction.movi, registerFirst, ...new Word(immediate).expand()];
        }

        if (registerFirst && symbolPointerSecond) {
            this._pointers[parseInt(registerFirst)] = symbolPointerSecond;
            return [Instruction.movi, registerFirst, ...symbolPointerSecond.address.expand()];
        }

        if (symbolFirst && immediate !== undefined) {
            const address = symbolFirst.address.add(new Byte(symbolFirst.type.SIZE - 1));
            return [Instruction.movim, ...address.expand(), new Byte(immediate)];
        }

        if (registerPointerFirst && immediate !== undefined) {
            const type = this._pointers[parseInt(registerPointerFirst)].type;
            if (type === Byte) {
                return [Instruction.movipb, registerPointerFirst, ...(new Word(immediate)).expand()];
            } else if (type === Word) {
                return [Instruction.movipw, registerPointerFirst, ...(new Word(immediate)).expand()];
            } else if (type === Double) {
                return [Instruction.movipd, registerPointerFirst, ...(new Word(immediate)).expand()];
            }
        }

        if (symbolPointerFirst && immediate !== undefined) {
            return [Instruction.movimp, ...symbolPointerFirst.address.expand(), new Byte(immediate)];
        }

        if (symbolFirst && registerSecond) {
            return [Instruction.movrm, ...symbolFirst.address.expand(), registerSecond];
        }

        if (registerFirst && symbolSecond) {
            return [Instruction.movm, registerFirst, ...symbolSecond.address.expand()];
        }

        if (registerFirst && registerPointerSecond) {
            return [Instruction.movp, registerFirst, registerPointerSecond, new Byte(0x00)];
        }

        if (registerPointerFirst && registerSecond) {
            return [Instruction.movrp, registerPointerFirst, registerSecond, new Byte(0x00)];
        }

        if (symbolPointerFirst && registerSecond) {
            return [Instruction.movrmp, ...symbolPointerFirst.address.expand(), registerSecond];
        }

        if (registerFirst && tableSecond) {
            return [Instruction.movm, registerFirst, ...this._getTableItemAddress(tableSecond).expand()];
        }

        if (tableFirst && immediate) {
            const address = this._getTableItemAddress(tableFirst).add(new Byte(tableFirst.symbol.type.SIZE - 1));
            return [Instruction.movim, ...address.expand(), new Byte(immediate)];
        }

        if (tableFirst && registerSecond) {
            return [Instruction.movrm, ...this._getTableItemAddress(tableFirst).expand(), registerSecond];
        }

        throw new Error(`Invalid operands to mov instruction`);
    }

    /**
     * @param {[String, String]} operands
     * @return {[Byte, Byte, Byte, Byte]}
     * @private
     */
    _parseMul(operands) {
        const multiplicand = Register[operands[0]];
        const immediate = this._parseImmediate(operands[1]);
        const register = Register[operands[1]];
        const symbol = this._parseSymbol(operands[1]);

        if (multiplicand && immediate !== undefined) {
            return [Instruction.muli, Register[operands[0]], ...(new Word(parseInt(operands[1]))).expand()];
        }

        if (multiplicand && register) {
            return [Instruction.mul, Register[operands[0]], register, new Byte(0x00)];
        }

        if (multiplicand && symbol) {
            return [Instruction.mulm, Register[operands[0]], ...symbol.address.expand()];
        }

        throw new Error(`Invalid operands to mul instruction`);
    }

    /**
     * @param {string|number} operand
     * @return {number|undefined}
     * @private
     */
    _parseImmediate(operand) {
        const value = parseInt(operand);
        if (Number.isInteger(value)) {
            return value;
        }

        if (operand.startsWith('\'') && operand.endsWith('\'')) {
            return operand.substring(1, 2).charCodeAt(0);
        }

        return undefined;
    }

    /**
     * @param {string} operand
     * @return {object|undefined}
     * @private
     */
    _parseSymbol(operand) {
        return this._symbols.find(symbol => symbol.name === operand);
    }

    /**
     * @param {string} operand
     * @return {string|undefined}
     * @private
     */
    _parsePointer(operand) {
        if (!operand.startsWith('[') || !operand.endsWith(']')) {
            return undefined;
        }

        return operand.substring(1, operand.length - 1);
    }

    /**
     * @param {string} operand
     * @return {{symbol: {name: string, address: Word, type: Function}, index: number}|undefined}
     * @private
     */
    _parseTable(operand) {
        const match = /([\w_-]+)\[(\d+)]/.exec(operand);
        if (match === null) {
            return undefined;
        }

        return {symbol: this._parseSymbol(match[1]), index: parseInt(match[2])};
    }

    /**
     * @param {{symbol: {name: string, address: Word, type: Function}, index: number}} tableOperand
     * @return {Word}
     * @private
     */
    _getTableItemAddress(tableOperand) {
        return tableOperand.symbol.address.add(new Byte(tableOperand.symbol.type.SIZE * tableOperand.index));
    }
};
