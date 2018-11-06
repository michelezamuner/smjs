const expect = require('./expect');

test('increment register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 0
            inc ebx
            syscall
    `).toExitWith(1);
});

test('decrement register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 2
            dec ebx
            syscall
    `).toExitWith(1);
});

test('add immediate to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 0
            add ebx, 1
            syscall
    `).toExitWith(1);
});

test('add register to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 0
            mov ecx, 1
            add ebx, ecx
            syscall
    `).toExitWith(1);
});

test('add memory to register', () => {
    return expect.program(`
        .data
            value   dd  1
        .text
            mov eax, 1
            mov ebx, 0
            add ebx, value
            syscall
    `).toExitWith(1);
});

test('subtract immediate from register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 2
            sub ebx, 1
            syscall
    `).toExitWith(1);
});

test('subtract register from register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ebx, 2
            mov ecx, 1
            sub ebx, ecx
            syscall
    `).toExitWith(1);
});

test('subtract memory from register', () => {
    return expect.program(`
        .data
            value   dd  1
        .text
            mov eax, 1
            mov ebx, 2
            sub ebx, value
            syscall
    `).toExitWith(1);
});

test('multiply register byte by immediate byte', () => {
    return expect.program(`
        .text
            mov al, 0x12
            mul al, 0x34
            mov bx, ax
            mov eax, 1
            syscall
    `).toExitWith(0xa8);
});

test('multiply register word by immediate word', () => {
    return expect.program(`
        .text
            mov bx, 0x1234
            mul bx, 0x5678
            mov eax, 1
            syscall
    `).toExitWith(0x60);
});

test('multiply register double by immediate word', () => {
    return expect.program(`
        .text
            mov ebx, 0xFEDC
            mul ebx, 0xBA98
            mov eax, 1
            mov ebx, edx
            syscall
    `).toExitWith(0xa0);
});

test('multiply register double by immediate word with alternate register', () => {
    return expect.program(`
        .text
            mov edx, 0xFEDC
            mul edx, 0xBA98
            mov ebx, eax
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});

test('multiply register byte by register byte', () => {
    return expect.program(`
        .text
            mov al, 0x12
            mov bl, 0x34
            mul bl, al
            mov eax, 1
            syscall
    `).toExitWith(0xa8);
});

test('multiply register word by register word', () => {
    return expect.program(`
        .text
            mov ax, 0x1234
            mov bx, 0x5678
            mul bx, ax
            mov eax, 1
            syscall
    `).toExitWith(0x60);
});

test('multiply register double by register double', () => {
    return expect.program(`
        .text
            mov eax, 0xFEDC
            mov ebx, 0xBA98
            mul ebx, eax
            mov ebx, edx
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});

test('multiply register double by register double with alternate register', () => {
    return expect.program(`
        .text
            mov eax, 0xFEDC
            mov edx, 0xBA98
            mul edx, eax
            mov ebx, eax
            mov eax, 1
            syscall
    `).toExitWith(0xa0);
});
