const Compiler = require('../../../../src/Compilers/PHP/Compiler');

/**
 * @type {null|Compiler}
 */
let compiler = null;

beforeEach(() => {
    compiler = new Compiler();
});

test('prints text outside PHP block tags to standard output', () => {
    const code = `<!doctype html>
<html>
    <head>
        <title>Sloth Machine</title>
    </head>
</html>    `;

    const asm = compiler.compile(code);

    const expected = `
.data
    text db "<!doctype html>\\n<html>\\n    <head>\\n        <title>Sloth Machine</title>\\n    </head>\\n</html>    "
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, 99
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
    `;

    expect(asm.trim()).toBe(expected.trim());
});

test('evaluates PHP blocks', () => {
    const code = `Some <?php echo 'code' ?> in <?php echo 'PHP' ?>`;

    const asm = compiler.compile(code);

    const expected = `
.data
    text db "Some code in PHP"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, 16
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
    `;

    expect(asm.trim()).toBe(expected.trim());
});

test('supports echo tag', () => {
    const code = `Some <?= 'code' ?> in <?= 'PHP' ?>`;

    const asm = compiler.compile(code);

    const expected = `
.data
    text db "Some code in PHP"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, 16
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
    `;

    expect(asm.trim()).toBe(expected.trim());
});

test('supports unclosed last block', () => {
    const code = `Some code <?php echo 'in PHP'`;

    const asm = compiler.compile(code);

    const expected = `
.data
    text db "Some code in PHP"
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, 16
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
    `;

    expect(asm.trim()).toBe(expected.trim());
});
