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
        movim 0x10, 0x00    ; can only store one byte at a time
        movim 0x11, 0x00
        movim 0x12, 0x00
        movim 0x13, 0x54
        movm ebx, 0x10      ; read four bytes (ebx)
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move immediate byte to register pointer', () => {
    return expect.exit(`
        movi eax, 1
        movi cx, 0x17       ; assume first three bytes from 0x14 are zero
        movipb cx, 0x54     ; write one byte to 0x17
        movm ebx, 0x14      ; read four bytes (ebx)
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move immediate word to register pointer', () => {
    return expect.exit(`
        movi eax, 1
        movi cx, 0x16       ; assume first two bytes from 0x14 are zero
        movipw cx, 0x54     ; write two bytes to 0x16
        movm ebx, 0x14      ; read four bytes (ebx)
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move immediate to memory pointer', () => {
    return expect.exit(`
        movi cx, 0x1B       ; assume first four bytes from 0x18 are zero
        movrm 0x1C, cx
        movi eax, 1
        movimp 0x1C, 0x54
        movm ebx, 0x18      ; read four bytes (ebx)
        syscall
    `, 0x54, '', '', 'rasm');
});

test('move memory to register', () => {
    return expect.exit(`
        movm eax, 0x0C
        movm ebx, 0x10
        syscall
        0x00 0x00 0x00 0x01 0x00 0x00 0x00 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move register pointer to register', () => {
    return expect.exit(`
        movi eax, 1
        movi cx, 0x10
        movp ebx, cx
        syscall
        0x00 0x00 0x00 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move memory pointer to register', () => {
    return expect.exit(`
        movi eax, 1
        movmp ebx, 0x0C
        syscall
        0x00 0x0E 0x00 0x00 0x00 0xA2
    `, 0xA2, '', '', 'rasm');
});

test('move register to memory', () => {
    return expect.exit(`
        movi eax, 1
        movi cl, 0xFE
        movrm 0x17, cl      ; assume first three bytes from 0x14 are zero
        movm ebx, 0x14
        syscall
    `, 0xFE, '', '', 'rasm');
});

test('move register to register pointer', () => {
    return expect.exit(`
        movi eax, 1
        movi cl, 0xFE
        movi dx, 0x1B       ; assume first three bytes from 0x18 are zero
        movrp dx, cl
        movm ebx, 0x18
        syscall
    `, 0xFE, '', '', 'rasm');
});

test('move register to memory pointer', () => {
    return expect.exit(`
        movi eax, 1
        movi cl, 0xFE
        movrmp 0x14, cl
        movm ebx, 0x16
        syscall
        0x00 0x19
    `, 0xFE, '', '', 'rasm');
});
