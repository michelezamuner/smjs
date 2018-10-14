const expect = require('./expect');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        .data
        .text
            mov eax, 1
            mov ebx, 5
            mov ecx, 3
            syscall
            mov eax, 1
            mov ebx, 4
            syscall
    `).toExitWith(5);
});

test('program is never terminated', () => {
    return expect.program(`
        .data
        .text
            mov eax, 5
            mov ebx, eax
    `).toExitWith(127, '', 'Missing exit instruction');
});
