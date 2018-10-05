const expect = require('../expect');

test('move register to register', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1
            mov ecx, 4
            mov ebx, ecx
            syscall
    `, 4);
});

test('move immediate to register', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1
            mov ebx, 5
            syscall
    `, 5);
});

test('move memory to register', () => {
    return expect.exit(`
        .data
            exit    db  0x01
            status  db  0xA2
        .text
            mov eax, exit
            mov ebx, status
            syscall
    `, 0xA2);
});

