const expect = require('../expect');

test('program terminates with specific exit status', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1
            mov ebx, 5
            mov ecx, 3
            syscall
            mov eax, 1
            mov ebx, 4
            syscall
    `, 5)
});

test('terminate program with specific exit status', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 5
            mov ebx, eax
    `, 1, '', 'Missing exit instruction');
});
