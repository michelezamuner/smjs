const expect = require('../expect');

test('move register to register', () => {
    return expect.exit(`
        .text
            mov eax, 1
            mov ecx, 4
            mov ebx, ecx
            syscall
    `, 4);
});

test('move immediate to register', () => {
    return expect.exit(`
        .text
            mov eax, 1
            mov ebx, 5
            syscall
    `, 5);
});

test('move immediate to memory', () => {
    return expect.exit(`
        .bss
            status      dd
        .text
            mov eax, 1
            mov status, 0x54
            mov ebx, status
            syscall
    `, 0x54);
});

test('move immediate to byte register pointer', () => {
    return expect.exit(`
        .bss
            status      db  times 3
            statusLow   db
        .text
            mov eax, 1
            mov cx, [statusLow]
            mov [cx], 0x54
            mov ebx, status
            syscall
    `, 0x54);
});

test('move immediate to word register pointer', () => {
    return expect.exit(`
        .bss
            status      dw
            statusLow   dw
        .text
            mov eax, 1
            mov cx, [statusLow]
            mov [cx], 0x1254
            mov ebx, status
            syscall
    `, 0x54);
});

test('move immediate to double register pointer', () => {
    return expect.exit(`
        .bss
            status  dd
        .text
            mov eax, 1
            mov cx, [status]
            mov [cx], 0x1254
            mov ebx, status
            syscall
    `, 0x54);
});

test('move immediate to memory pointer', () => {
    return expect.exit(`
        .bss
            status       db  times 3
            statusLow    db
            statusPtr    dw
        .text
            mov cx, [statusLow]
            mov statusPtr, cx
            mov [statusPtr], 0x54
            mov eax, 1
            mov ebx, status
            syscall
    `, 0x54);
});

test('move memory to register', () => {
    return expect.exit(`
        .data
            exit    dd  0x01
            status  dd  0xA2
        .text
            mov eax, exit
            mov ebx, status
            syscall
    `, 0xA2);
});

test('move register pointer to register', () => {
    return expect.exit(`
        .data
            status   dd  0xA2
        .text
            mov eax, 1
            mov cx, [status]
            mov ebx, [cx]
            syscall
    `, 0xA2);
});

test('move register to memory', () => {
    return expect.exit(`
        .bss
            status  dd
        .text
            mov eax, 1
            mov ecx, 0xFE
            mov status, ecx
            mov ebx, status
            syscall
    `, 0xFE);
});

test('move register to register pointer', () => {
    return expect.exit(`
        .bss
            status  dd
        .text
            mov eax, 1
            mov ecx, 0xFE
            mov dx, [status]
            mov [dx], ecx
            mov ebx, status
            syscall
    `, 0xFE);
});

test('move register to memory pointer', () => {
    return expect.exit(`
        .bss
            status      dd
            statusPtr   dw
        .text
            mov dx, [status]
            mov statusPtr, dx
            mov eax, 1
            mov ecx, 0xFE
            mov [statusPtr], ecx
            mov ebx, status
            syscall
    `, 0xFE);
});

test('move from table of bytes', () => {
    return expect.exit(`
        .data
            table   db  1 2 3 4
        .text
            mov al, table[0]
            mov bl, table[1]
            mov cl, table[2]
            mov dl, table[3]
            syscall
    `, 2);
});

test('move from table of words', () => {
    return expect.exit(`
        .data
            table   dw  1 2 3 4
        .text
            mov ax, table[0]
            mov bx, table[1]
            mov cx, table[2]
            mov dx, table[3]
            syscall
    `, 2);
});

test('move from table of doubles', () => {
    return expect.exit(`
        .data
            table   dd  1 2 3 4
        .text
            mov eax, table[0]
            mov ebx, table[1]
            mov ecx, table[2]
            mov edx, table[3]
            syscall
    `, 2);
});

test('move immediate to table of bytes', () => {
    return expect.exit(`
        .bss
            table   db  times 3
        .text
            mov table[0], 1
            mov table[1], 2
            mov table[2], 0x93
            mov al, table[0]
            mov bl, table[2]
            syscall
    `, 0x93);
});

test('move immediate to table of words', () => {
    return expect.exit(`
        .bss
            table   dw  times 3
        .text
            mov table[0], 1
            mov table[1], 2
            mov table[2], 0x93
            mov ax, table[0]
            mov bx, table[2]
            syscall
    `, 0x93);
});

test('move immediate to table of doubles', () => {
    return expect.exit(`
        .bss
            table   dd  times 3
        .text
            mov table[0], 1
            mov table[1], 2
            mov table[2], 0x93
            mov eax, table[0]
            mov ebx, table[2]
            syscall
    `, 0x93);
});

test('move register to table of bytes', () => {
    return expect.exit(`
        .bss
            table   db  3
        .text
            mov cl, 1
            mov al, 2
            mov dl, 0x93
            mov table[0], cl
            mov table[1], al
            mov table[2], dl
            mov al, table[0]
            mov bl, table[2]
            syscall
    `, 0x93);
});

test('move register to table of words', () => {
    return expect.exit(`
        .bss
            table   dw  3
        .text
            mov cx, 1
            mov ax, 2
            mov dx, 0x93
            mov table[0], cx
            mov table[1], ax
            mov table[2], dx
            mov ax, table[0]
            mov bx, table[2]
            syscall
    `, 0x93);
});

test('move register to table of doubles', () => {
    return expect.exit(`
        .bss
            table   dd  3
        .text
            mov ecx, 1
            mov eax, 2
            mov edx, 0x93
            mov table[0], ecx
            mov table[1], eax
            mov table[2], edx
            mov eax, table[0]
            mov ebx, table[2]
            syscall
    `, 0x93);
});

test('move immediate characters', () => {
    return expect.exit(`
        .text
            mov eax, 1
            mov ebx, '?'
            syscall
    `, 63);
});
