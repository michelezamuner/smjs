/**
 * Source code parser.
 */
module.exports = class Parser {
    /**
     * Parse the given source code to produce executable instructions.
     *
     * @param {string} code
     * @return {array}
     */
    parse(code) {
        let instructions = [];

        const trimmedCode = code.trim();
        if (trimmedCode === '') {
            return instructions;
        }

        const lines = trimmedCode.split("\n").map(line => line.trim());
        lines.forEach(line => {
            instructions.push(this._parseInstruction(line));
        });

        return instructions;
    }

    /**
     * @param {string} line
     * @returns {object}
     * @private
     */
    _parseInstruction(line) {
        const opcodeDelimiter = line.indexOf(' ');
        if (opcodeDelimiter === -1) {
            return {opcode: line, operands: []};
        }

        const opcode = line.substring(0, opcodeDelimiter);
        const operandsString = line.substring(opcodeDelimiter + 1);
        const operands = operandsString.split(',').map(operand => operand.trim());

        return {opcode: opcode, operands: operands};
    }
};
