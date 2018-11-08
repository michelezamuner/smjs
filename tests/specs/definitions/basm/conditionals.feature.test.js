const expect = require('../expect').for('basm');

test('jump unconditionally', () => {
    return expect.program(`
        .text
            mov eax, 1
            jmp exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register equal to immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, 1
            je exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register equal to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            mov edx, 1
            cmp ecx, edx
            je exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register equal to memory', () => {
    return expect.program(`
        .data
            x   dd  0x01
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, x
            je exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register not equal to immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, 2
            jne exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register equal to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            mov edx, 2
            cmp ecx, edx
            jne exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register equal to memory', () => {
    return expect.program(`
        .data
            x   dd  0x02
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, x
            jne exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, 0
            jg exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            mov edx, 0
            cmp ecx, edx
            jg exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than memory', () => {
    return expect.program(`
        .data
            x   dd  0x00
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, x
            jg exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than or equal to immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, 0
            jge step
            mov eax, 5
            step:
            cmp ecx, 1
            jge exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than or equal to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 1
            mov edx, 0
            cmp ecx, edx
            jge step
            mov eax, 5
            step:
            mov edx, 1
            cmp ecx, edx
            jge exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register greater than or equal to memory', () => {
    return expect.program(`
        .data
            x   dd      0x00
        .text
            mov eax, 1
            mov ecx, 1
            cmp ecx, x
            jge step
            mov eax, 5
            step:
            mov x, 1
            cmp ecx, x
            jge exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 0
            cmp ecx, 1
            jl exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 0
            mov edx, 1
            cmp ecx, edx
            jl exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than memory', () => {
    return expect.program(`
        .data
            x   dd  0x01
        .text
            mov eax, 1
            mov ecx, 0
            cmp ecx, x
            jl exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than or equal to immediate', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 0
            cmp ecx, 1
            jle step
            mov eax, 5
            step:
            cmp ecx, 0
            jle exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than or equal to register', () => {
    return expect.program(`
        .text
            mov eax, 1
            mov ecx, 0
            mov edx, 1
            cmp ecx, edx
            jle step
            mov eax, 5
            step:
            mov edx, 0
            cmp ecx, edx
            jle exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});

test('jump if register less than or equal to memory', () => {
    return expect.program(`
        .data
            x   dd      0x01
        .text
            mov eax, 1
            mov ecx, 0
            cmp ecx, x
            jle step
            mov eax, 5
            step:
            mov x, 0
            cmp ecx, x
            jle exit
            mov eax, 5
            exit:
            mov ebx, 1
            syscall
    `).toExitWith(1);
});
