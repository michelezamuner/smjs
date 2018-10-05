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
        movmb bl, 0x10
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move memory to register', () => {
    return expect.exit(`
        movmb al, 0x0C
        movmb bl, 0x0D
        syscall
        0x01 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move register to memory', () => {
    return expect.exit(`
        movi al, 1
        movi cl, 0xFE
        movrm 0x14, cl
        movmb bl, 0x14
        syscall
    `, 0xFE, '', '', 'rasm');
});

