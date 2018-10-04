const expect = require('../expect');

test('move with immediate addressing', () => {
    return expect.exit(`
        movi eax, 1
        movi ebx, 5
        syscall
    `, 5, '', '', 'rasm');
});

test('move with register addressing', () => {
    return expect.exit(`
        movi eax, 1
        movi ecx, 0
        mov ebx, ecx
        syscall
    `, 0, '', '', 'rasm');
});

test('move with direct memory addressing', () => {
    return expect.exit(`
        movmb eax, 0x0C
        movmb ebx, 0x0D
        syscall
        0x01 0xFE
    `, 254, '', '', 'rasm');
});

