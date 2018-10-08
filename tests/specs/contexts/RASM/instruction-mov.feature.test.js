const expect = require('../expect');

test('move register to register', () => {
    return expect.exit(`
        movi al, 1
        movi cl, 4
        mov bl, cl
        syscall
    `, 4, '', '', 'rasm');
});

test('move immediate to register', () => {
    return expect.exit(`
        movi al, 1
        movi bl, 5
        syscall
    `, 5, '', '', 'rasm');
});

test('move immediate to memory', () => {
    return expect.exit(`
        movi al, 1
        movim 0x10, 0x54
        movm bl, 0x10
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move immediate byte to register pointer', () => {
    return expect.exit(`
        movi al, 1
        movi cx, 0x14
        movipb cx, 0x54
        movm bl, 0x14
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move immediate word to register pointer', () => {
    return expect.exit(`
        movi al, 1
        movi cx, 0x14
        movipw cx, 0x54
        movm bl, 0x15
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move memory to register', () => {
    return expect.exit(`
        movm al, 0x0C
        movm bl, 0x0D
        syscall
        0x01 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move register to memory', () => {
    return expect.exit(`
        movi al, 1
        movi cl, 0xFE
        movrm 0x14, cl
        movm bl, 0x14
        syscall
    `, 0xFE, '', '', 'rasm');
});

