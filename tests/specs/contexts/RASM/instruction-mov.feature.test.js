const expect = require('../expect');

test('move register to register', () => {
    return expect.exit(`
        movi eax, 1
        movi ecx, 4
        mov ebx, ecx
        syscall
    `, 4, '', '', 'rasm');
});

test('move immediate to register', () => {
    return expect.exit(`
        movi eax, 1
        movi ebx, 5
        syscall
    `, 5, '', '', 'rasm');
});

test('move immediate to memory', () => {
    return expect.exit(`
        movi eax, 1
        movim 0x10, 0x54
        movmb ebx, 0x10
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move memory to register', () => {
    return expect.exit(`
        movmb eax, 0x0C
        movmb ebx, 0x0D
        syscall
        0x01 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move register to memory', () => {
    return expect.exit(`
        movi eax, 1
        movi ecx, 0xFE
        movrm 0x14, ecx
        movmw ebx, 0x14
        syscall
    `, 0xFE, '', '', 'rasm');
});

