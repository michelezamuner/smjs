const expect = require('../expect');

test('program terminates with specific exit status', () => {
    return expect.exit(`
        .data
        .text
            mov al, 1
            mov bl, 5
            mov cl, 3
            syscall
            mov al, 1
            mov bl, 4
            syscall
    `, 5)
});

test('terminate program with specific exit status', () => {
    return expect.exit(`
        .data
        .text
            mov al, 5
            mov bl, al
    `, 1, '', 'Missing exit instruction');
});
