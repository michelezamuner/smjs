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
        return code.split("\n")
            .map(line => line.trim())
            .filter(this._isNotEmptyLine)
            .filter(this._isNotCommentLine)
            .map(this._parseInstruction);
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
            return {opcode: line, operands: []};
        }

        const opcode = line.substring(0, opcodeDelimiter);
        const operandsString = line.substring(opcodeDelimiter + 1);
        const operands = operandsString.split(',').map(operand => operand.trim());

        return {opcode: opcode, operands: operands};
    }
};
