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
