const expect = require('./expect');

test('multiply register byte by immediate byte', () => {
    return expect.program(`
        .text
            mov al, 0x12
            mul al, 0x34
            mov bx, ax
            mov eax, 1
            syscall
    `).toExitWith(0xa8);
});

test('multiply register word by immediate word', () => {
    return expect.program(`
        .text
            mov bx, 0x1234
            mul bx, 0x5678
            mov eax, 1
            syscall
    `).toExitWith(0x60);
});

test('multiply register double by immediate word', () => {
    return expect.program(`
        .text
            mov ebx, 0xFEDC
            mul ebx, 0xBA98
            mov eax, 1
            mov ebx, edx
            syscall
    `).toExitWith(0xa0);
});

test('multiply register double by immediate word with alternate register', () => {
    return expect.program(`
        .text
            mov edx, 0xFEDC
            mul edx, 0xBA98
            mov ebx, eax
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});
