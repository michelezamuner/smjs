const expect = require('../expect');

test('call sys_exit with specific exit status', () => {
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

test('sys_exit is never called', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 5
            mov ebx, eax
    `, 1, '', 'Missing exit instruction');
});
