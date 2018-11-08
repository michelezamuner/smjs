const expect = require('../expect').for('rasm');

test('program is terminated with specific exit status', () => {
    return expect.program(`
        movi eax, 1
        movi ebx, 5
        movi ecx, 3
        syscall
        movi eax, 1
        movi ebx, 4
        syscall
    `).toExitWith(5);
});

test('program is never terminated', () => {
    return expect.program(`
        movi eax, 5
        mov eax, ebx
    `).toExitWith(127, '', 'Missing exit instruction');
});
