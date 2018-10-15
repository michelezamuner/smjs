const Compiler = require('../../../../src/Compilers/PHP/Compiler');

/**
 * @type {null|Compiler}
 */
let compiler = null;

beforeEach(() => {
    compiler = new Compiler();
});

test('text outside PHP block tags is printed to standard output', () => {
    const code = `
<!doctype html>
<html>
    <head>
        <title>Sloth Machine</title>
    </head>
</html>
    `;

    const asm = compiler.compile(code);

    const expected = `
.data
    text db "<!doctype html>\\n<html>\\n    <head>\\n        <title>Sloth Machine</title>\\n    </head>\\n</html>"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, 69
    syscall
    `;
    expect(asm.trim()).toBe(expected.trim());
});
