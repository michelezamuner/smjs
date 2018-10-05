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
        movmi 0x18, 1
        movmb eax, 0x18
        movi ecx, 0xFE
        movmr 0x19, ecx
        movmw ebx, 0x19
        syscall
    `, 254, '', '', 'rasm');
});

