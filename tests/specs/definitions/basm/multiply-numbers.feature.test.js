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

test('multiply register byte by register byte', () => {
    return expect.program(`
        .text
            mov al, 0x12
            mov bl, 0x34
            mul bl, al
            mov eax, 1
            syscall
    `).toExitWith(0xa8);
});

test('multiply register word by register word', () => {
    return expect.program(`
        .text
            mov ax, 0x1234
            mov bx, 0x5678
            mul bx, ax
            mov eax, 1
            syscall
    `).toExitWith(0x60);
});

test('multiply register double by register double', () => {
    return expect.program(`
        .text
            mov eax, 0xFEDC
            mov ebx, 0xBA98
            mul ebx, eax
            mov ebx, edx
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});

test('multiply register double by register double with alternate register', () => {
    return expect.program(`
        .text
            mov eax, 0xFEDC
            mov edx, 0xBA98
            mul edx, eax
            mov ebx, eax
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});
