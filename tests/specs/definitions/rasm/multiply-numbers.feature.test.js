const expect = require('./expect');

test('multiply register byte by immediate byte', () => {
    return expect.program(`
        movi al, 0x12
        muli al, 0x34
        mov bx, ax
        movi eax, 1
        syscall
    `).toExitWith(0xa8);
});

test('multiply register word by immediate word', () => {
    return expect.program(`
        movi bx, 0x1234
        muli bx, 0x5678
        movi eax, 1
        syscall
    `).toExitWith(0x60);
});

test('multiply register double by immediate word', () => {
    return expect.program(`
        movi ebx, 0xFEDC
        muli ebx, 0xBA98
        movi eax, 1
        mov ebx, edx
        syscall
    `).toExitWith(0xa0);
});

test('multiply register double by immediate word with alternate register', () => {
    return expect.program(`
        movi edx, 0xFEDC
        muli edx, 0xBA98
        mov ebx, eax
        movi eax, 1
        syscall
    `).toExitWith(0xa0);
});

test('multiply register byte by register byte', () => {
    return expect.program(`
        movi al, 0x12
        movi bl, 0x34
        mul bl, al
        movi eax, 1
        syscall
    `).toExitWith(0xa8);
});

test('multiply register word by register word', () => {
    return expect.program(`
        movi ax, 0x1234
        movi bx, 0x5678
        mul bx, ax
        movi eax, 1
        syscall
    `).toExitWith(0x60);
});

test('multiply register double by register double', () => {
    return expect.program(`
        movi eax, 0xFEDC
        movi ebx, 0xBA98
        mul ebx, eax
        mov ebx, edx
        movi eax, 1
        syscall
    `).toExitWith(0xa0);
});

test('multiply register double by register double with alternate register', () => {
    return expect.program(`
        movi eax, 0xFEDC
        movi edx, 0xBA98
        mul edx, eax
        mov ebx, eax
        movi eax, 1
        syscall
    `).toExitWith(0xa0);
});
