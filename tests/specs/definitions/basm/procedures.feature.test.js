const expect = require('../expect').for('basm');

test('call procedure with no arguments and that does not return', () => {
    return expect.program(`
        .text
            call exit
            mov eax, 1
            mov ebx, 2
            syscall
            
            exit:
                mov eax, 1
                mov ebx, 1
                syscall
    `).toExitWith(1);
});

test('call procedure with no arguments and no return value', () => {
    return expect.program(`
        .text
            mov eax, 1
            call set_exit_status
            syscall
            
            set_exit_status:
                mov ebx, 1
                ret
    `).toExitWith(1);
});

test('call procedure with no arguments and immediate return value', () => {
    return expect.program(`
        .text
            mov eax, 1
            call get_exit_status
            pop bl
            syscall
            
            get_exit_status:
                ret 1
    `).toExitWith(1);
});

test('call procedure with no arguments and register return value', () => {
    return expect.program(`
        .text
            mov eax, 1
            call get_exit_status
            pop ebx
            syscall
            
            get_exit_status:
                mov ecx, 1
                ret ecx
    `).toExitWith(1);
});

test('call procedure with no arguments and memory return byte value', () => {
    return expect.program(`
        .data
            exit_status db 1
        .text
            mov eax, 1
            call get_exit_status
            pop bl
            syscall
            
            get_exit_status:
                ret exit_status
    `).toExitWith(1);
});

test('call procedure with no arguments and memory return word value', () => {
    return expect.program(`
        .data
            exit_status dw 1
        .text
            mov eax, 1
            call get_exit_status
            pop bx
            syscall
            
            get_exit_status:
                ret exit_status
    `).toExitWith(1);
});

test('call procedure with no arguments and memory return double value', () => {
    return expect.program(`
        .data
            exit_status dd 1
        .text
            mov eax, 1
            call get_exit_status
            pop ebx
            syscall
            
            get_exit_status:
                ret exit_status
    `).toExitWith(1);
});

test('call procedure with arguments and return value', () => {
    return expect.program(`
        .data
            arg3 dw 3
        .text
            push 1
            mov eax, 2
            push eax
            push arg3
            call get_exit_status, 8
            pop ebx
            mov eax, 1
            syscall
            
            get_exit_status:
                pop cx
                pop ebx
                pop ax
                mov edx, 0
                add edx, ax
                add edx, ebx
                add edx, cx
                ret edx
    `).toExitWith(6);
});
