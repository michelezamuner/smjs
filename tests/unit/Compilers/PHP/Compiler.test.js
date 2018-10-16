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

    expectData(asm, '"<!doctype html>" 10 "<html>" 10 "    <head>" 10 "        <title>Sloth Machine</title>" 10 "    </head>" 10 "</html>    "', 94);
});

test('evaluates PHP blocks', () => {
    const code = `Some
<?php echo 'code' ?>
in
<?php echo 'PHP' ?>`;
    const asm = compiler.compile(code);

    expectData(asm, '"Some" 10 "code" 10 "in" 10 "PHP"', 16);
});

test('supports echo tag', () => {
    const code = `Some <?= 'code' ?> in <?= 'PHP' ?>`;
    const asm = compiler.compile(code);

    expectData(asm, '"Some code in PHP"', 16);
});

test('supports unclosed last block', () => {
    const code = `Some code
<?php echo 'in PHP'`;
    const asm = compiler.compile(code);

    expectData(asm, '"Some code" 10 "in PHP"', 16);
});

/**
 * @param {string} asm
 * @param {string} data
 * @param {number} length
 */
function expectData(asm, data, length) {
    const expected = `
.data
    text db ${data}
.text
    mov eax, 4
    mov ebx, 1
    mov ecx, [text]
    mov edx, ${length}
    syscall
    mov eax, 1
    mov ebx, 0
    syscall
    `;

    expect(asm.trim()).toBe(expected.trim());
}
