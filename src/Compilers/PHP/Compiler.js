module.exports = class Compiler {
    /**
     * @param {string} code
     * @return {string}
     */
    compile(code) {
        code = this._normalize(code);
        code = this._evaluateBlocks(code);

        return `
.data
    text db "${code}"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, ${code.length}
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
        `;
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _normalize(code) {
        return code.replace(/\n/g, '\\n');
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _evaluateBlocks(code) {
        const regex = /<\?php\s+(.*?)\s+\?>/g;

        return code.replace(regex, (match, block) => this._evaluateBlock(block));
    }

    /**
     * @param {string} block
     * @return {string}
     * @private
     */
    _evaluateBlock(block) {
        const match = /echo ['"](.*)['"]/.exec(block);

        return match[1];
    }
};
