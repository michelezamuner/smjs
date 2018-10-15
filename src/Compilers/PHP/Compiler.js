module.exports = class Compiler {
    /**
     * @param {string} code
     * @return {string}
     */
    compile(code) {
        code = this._normalize(code);
        code = this._evaluateBlockTags(code);
        code = this._evaluateEchoTags(code);
        code = this._evaluateLastBlockTag(code);

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
    _evaluateBlockTags(code) {
        const regex = /<\?php\s+(.*?)\s+\?>/g;

        return code.replace(regex, (match, block) => this._evaluateBlockTag(block));
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _evaluateLastBlockTag(code) {
        const regex = /<\?php\s+(.*?)$/;

        return code.replace(regex, (match, block) => this._evaluateBlockTag(block));
    }

    /**
     * @param {string} code
     * @return {string}
     * @private
     */
    _evaluateEchoTags(code) {
        const regex = /<\?=\s+(.*?)\s+\?>/g;

        return code.replace(regex, (match, echo) => this._evaluateEchoTag(echo));
    }

    /**
     * @param {string} block
     * @return {string}
     * @private
     */
    _evaluateBlockTag(block) {
        const match = /echo ['"](.*)['"]/.exec(block);

        return match[1];
    }

    /**
     * @param {string} echo
     * @return {string}
     * @private
     */
    _evaluateEchoTag(echo) {
        return echo.replace(/['"]/g, '');
    }
};
