const expect = require('../expect').for('rasm');

test('increment register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 0
        inc ebx
        syscall
    `).toExitWith(1);
});

test('decrement register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 2
        dec ebx
        syscall
    `).toExitWith(1);
});

test('add immediate to register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 0
        addi ebx, 1
        syscall
    `).toExitWith(1);
});

test('add register to register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 0
        movi ecx, 1
        add ebx, ecx
        syscall
    `).toExitWith(1);
});

test('add memory to register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 0
        addm ebx, 0x10
        syscall
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('subtract immediate from register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 2
        subi ebx, 1
        syscall
    `).toExitWith(1);
});

test('subtract register from register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 2
        movi ecx, 1
        sub ebx, ecx
        syscall
    `).toExitWith(1);
});

test('subtract memory from register', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 2
        subm ebx, 0x10
        syscall
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

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

test('multiply register byte by memory', () => {
    return expect.program(`
        movi bl, 0x34
        mulm bl, 0x10
        movi eax, 1
        syscall
        0x12
    `).toExitWith(0xa8);
});

test('multiply register byte by memory', () => {
    return expect.program(`
        movi bx, 0x5678
        mulm bx, 0x10
        movi eax, 1
        syscall
        0x12 0x34
    `).toExitWith(0x60);
});

test('multiply register double by memory', () => {
    return expect.program(`
        movi ebx, 0x7654
        mulm ebx, 0x14
        mov ebx, edx
        movi eax, 1
        syscall
        0xFE 0xDC 0xBA 0x98
    `).toExitWith(0xe0);
});

test('multiply register double by memory', () => {
    return expect.program(`
        movi edx, 0x7654
        mulm edx, 0x14
        mov ebx, eax
        movi eax, 1
        syscall
        0xFE 0xDC 0xBA 0x98
    `).toExitWith(0xe0);
});
