const expect = require('../expect');

test('move register to register', () => {
    return expect.exit(`
        .data
        .text
            mov al, 1
            mov cl, 4
            mov bl, cl
            syscall
    `, 4);
});

test('move immediate to register', () => {
    return expect.exit(`
        .data
        .text
            mov al, 1
            mov bl, 5
            syscall
    `, 5);
});

test('move memory to register', () => {
    return expect.exit(`
        .data
            exit    db  0x01
            status  db  0xA2
        .text
            mov al, exit
            mov bl, status
            syscall
    `, 0xA2);
});

