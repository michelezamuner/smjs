module.exports = class Compiler {
    /**
     * @param {string} code
     * @return {string}
     */
    compile(code) {
        const normalizedCode = code.trim().replace(/\n/g, '\\n');
        return `
.data
    text db "${normalizedCode}"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, ${normalizedCode.length}
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
        `;
    }
};
