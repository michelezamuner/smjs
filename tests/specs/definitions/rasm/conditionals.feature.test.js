const expect = require('./expect');

test('jump unconditionally', () => {
    return expect.program(`
        movi eax, 1
        jmp 0x0C
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1)
});

test('jump if register equal to immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpi ecx, 1
        je 0x14
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register equal to register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        movi edx, 1
        cmp ecx, edx
        je 0x18
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register equal to memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpm ecx, 0x1C
        je 0x14
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('jump if register not equal to immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpi ecx, 2
        jne 0x14
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register equal to register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        movi edx, 2
        cmp ecx, edx
        jne 0x18
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register equal to memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpm ecx, 0x1C
        jne 0x14
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x02
    `).toExitWith(1);
});

test('jump if register greater than immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpi ecx, 0
        jg 0x14
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register greater than register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        movi edx, 0
        cmp ecx, edx
        jg 0x18
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register greater than memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpm ecx, 0x1C
        jg 0x14
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register greater than or equal to immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpi ecx, 0
        jge 0x14
        movi eax, 5
        cmpi ecx, 1
        jge 0x20
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register greater than or equal to register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        movi edx, 0
        cmp ecx, edx
        jge 0x18
        movi eax, 5
        movi edx, 1
        cmp ecx, edx
        jge 0x28
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register greater than or equal to memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 1
        cmpm ecx, 0x2C
        jge 0x14
        movi eax, 5
        movim 0x2F, 1
        cmpm ecx, 0x2C
        jge 0x24
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x00
    `).toExitWith(1);
});

test('jump if register less than immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        cmpi ecx, 1
        jl 0x14
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register less than register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        movi edx, 1
        cmp ecx, edx
        jl 0x18
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register less than memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        cmpm ecx, 0x1C
        jl 0x14
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});

test('jump if register less than or equal to immediate', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        cmpi ecx, 1
        jle 0x14
        movi eax, 5
        cmpi ecx, 0
        jle 0x20
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register less than or equal to register', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        movi edx, 1
        cmp ecx, edx
        jle 0x18
        movi eax, 5
        movi edx, 0
        cmp ecx, edx
        jle 0x28
        movi eax, 5
        movi ebx, 1
        syscall
    `).toExitWith(1);
});

test('jump if register less than or equal to memory', () => {
    return expect.program(`
        movi eax, 1
        movi ecx, 0
        cmpm ecx, 0x2C
        jle 0x14
        movi eax, 5
        movim 0x2F, 0
        cmpm ecx, 0x2C
        jle 0x24
        movi eax, 5
        movi ebx, 1
        syscall
        0x00 0x00 0x00 0x01
    `).toExitWith(1);
});
