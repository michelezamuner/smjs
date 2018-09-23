const expect = require('../expect');

/**
 * Feature: Exit status
 *   As a programmer
 *   I want to write a program that terminates with an exit status
 *   In order to communicate to the operating system the status at program termination
*/

/**
 * Scenario: run empty program
 *   Given the program is:
 *     """
 *     """
 *   When I run the program
 *   Then the program terminates with exit status 0
 */
test('run empty program', () => {
    return expect.exitStatus('', 0);
});

/**
 * Scenario: let program terminate naturally
 *   Given the program is:
 *     """
 *     mov eax, 1
 *     mov ebx, 2
 *     """
 *   When I run the program
 *   Then the program terminates with exit status 0
 */
test('let program terminate naturally', () => {
    return expect.exitStatus(`
        mov eax, 1
        mov ebx, 2
    `, 0);
});

/**
 * Scenario: terminate program with specific exit status
 *   Given the program is:
 *     """
 *     mov eax, 1
 *     mov ebx, 5
 *     mov ecx, 3
 *     syscall
 *     mov eax, 1
 *     mov eax, 4
 *     syscall
 *     """
 *   When I run the program
 *   Then the program terminates with exit status 5
 */
test('terminate program with specific exit status', () => {
    return expect.exitStatus(`
        mov eax, 1
        mov ebx, 5
        mov ecx, 3
        syscall
        mov eax, 1
        mov eax, 4
        syscall
    `, 5)
});
