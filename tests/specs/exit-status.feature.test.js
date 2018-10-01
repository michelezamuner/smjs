const expect = require('./expect');

/**
 * Feature: Exit status
 *   As a programmer
 *   I want to write a program that terminates with an exit status
 *   In order to communicate to the operating system the status at program termination
*/

/**
 * Scenario: terminate program with specific exit status
 *   Given the program is:
 *     """
 *     mov eax, 1   ; system call 1: exit
 *     mov ebx, 5   ; exit status
 *     mov ecx, 3   ; shouldn't affect the system call
 *     syscall      ; execute system call
 *
 *     ; the following lines shouldn't be executed
 *     mov eax, 1
 *     mov eax, 4
 *     syscall
 *     """
 *   When I run the program
 *   Then the program terminates with exit status 5
 */
test('terminate program with specific exit status', () => {
    return expect.exitStatus(`
        mov eax, 1  ; system call 1: exit
        mov ebx, 5  ; exit status
        mov ecx, 3  ; shouldn't affect the system call
        syscall     ; execute system call
        
        ; the following lines shouldn't be executed
        mov eax, 1
        mov eax, 4
        syscall
    `, 5)
});
