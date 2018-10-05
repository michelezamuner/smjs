const expect = require('../expect');

test('move to register with immediate addressing', () => {
    return expect.exit(`
        movi eax, 1
        movi ebx, 5
        syscall
    `, 5, '', '', 'rasm');
});

test('move to register with register addressing', () => {
    return expect.exit(`
        movi eax, 1
        movi ecx, 4
        mov ebx, ecx
        syscall
    `, 4, '', '', 'rasm');
});

test('move to register with direct memory addressing', () => {
    return expect.exit(`
        movmb eax, 0x0C
        movmb ebx, 0x0D
        syscall
        0x01 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move to memory with immediate addressing', () => {
    return expect.exit(`
        movi eax, 1
        movmi 0x10, 0x54
        movmb ebx, 0x10
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move to memory with direct memory addressing', () => {
    return expect.exit(`
        movi eax, 1
        movi ecx, 0xFE
        movmr 0x14, ecx
        movmw ebx, 0x14
        syscall
    `, 0xFE, '', '', 'rasm');
});

