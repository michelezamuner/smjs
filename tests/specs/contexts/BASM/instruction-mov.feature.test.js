const expect = require('../expect');

test('move with immediate addressing', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1
            mov ebx, 5
            syscall
    `, 5);
});

test('move with register addressing', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1
            mov ecx, 0
            mov ebx, ecx
            syscall
    `, 0);
});

test('move with direct memory addressing', () => {
    return expect.exit(`
        .data
            exit    db  0x01
            status  db  0xFE
        .text
            mov eax, exit
            mov ebx, status
            syscall
    `, 254);
});

