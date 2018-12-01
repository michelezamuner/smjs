const expect = require('../expect').for('rasm');

test('call procedure with no arguments and that does not return', () => {
    return expect.program(`
        call 0x10
        movi eax, 1
        movi ebx, 2
        syscall
        movi eax, 1
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('call procedure with no arguments and no return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x0C
        syscall
        movi ebx, 1
        ret
    `).toExitWith(1);
});

test('call procedure with no arguments and immediate return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x10
        pop bx
        syscall
        reti 1
    `).toExitWith(1);
});

test('call procedure with no arguments and register return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x10
        pop ebx
        syscall
        movi ecx, 1
        retr ecx
    `).toExitWith(1);
});

test('call procedure with no arguments and memory byte return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x10
        pop bl
        syscall
        retmb 0x14
        0x01
    `).toExitWith(1);
});

test('call procedure with no arguments and memory word return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x10
        pop bx
        syscall
        retmw 0x14
        0x00 0x01
    `).toExitWith(1);
});

test('call procedure with no arguments and memory double return value', () => {
    return expect.program(`
        movi eax, 1
        call 0x10
        pop ebx
        syscall
        retmd 0x14
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('call procedure with arguments and return value', () => {
    return expect.program(`
        pushi 1
        movi eax, 2
        push eax
        pushmw 0x40
        calla 0x20, 8
        pop ebx
        movi eax, 1
        syscall
        movi edx, 0
        pop cx
        pop ebx
        pop ax
        add edx, ax
        add edx, ebx
        add edx, cx
        retr edx
        0x00 0x03
    `).toExitWith(6);
});
