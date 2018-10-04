const expect = require('./expect');

/**
 * Feature: Instruction mov
 *   As a programmer
 *   I want to move data from one storage to another
 *   In order to be able to work with data in a program
 */

/**
 * Scenario: move with immediate addressing
 *   Given the program is:
 *      """
 *      .data
 *      .text
 *          mov eax, 1  ; system call 1: exit
 *          mov ebx, 5  ; exit status
 *          syscall     ; execute system call
 *      """
 *   When I run the program
 *   Then the program terminates with exit status 5
 */
test('move with immediate addressing', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1  ; system call 1: exit
            mov ebx, 5  ; exit status
            syscall     ; execute system call
    `, 5);
});

/**
 * Scenario: move with register addressing
 *   Given the program is:
 *      """
 *      .data
 *      .text
 *          mov eax, 1      ; system call 1: exit
 *          mov ecx, 0      ; store exit status in intermediate register
 *          mov ebx, ecx    ; take exit status from ecx
 *          syscall         ; execute system call
 *      """
 *   When I run the program
 *   Then the program terminates with exit status 4
 */
test('move with register addressing', () => {
    return expect.exit(`
        .data
        .text
            mov eax, 1      ; system call 1: exit
            mov ecx, 0      ; store exit status in intermediate register
            mov ebx, ecx    ; take exit status from ecx
            syscall         ; execute system call
    `, 0);
});

/**
 * Scenario: move with direct memory addressing
 *   Given the program is:
 *      """
 *      .data
 *          exit    db  0x01
 *          status  dw  0xFEDC
 *      .text
 *          mov eax, exit
 *          mov ebx, status
 *          syscall
 *      """
 *   When I run the program
 *   Then the program terminates with exit status -292
 */
test('move with direct memory addressing', () => {
    return expect.exit(`
        .data
            exit    db  0x01
            status  dw  0x00FF
        .text
            mov eax, exit
            mov ebx, status
            syscall
    `, 255);
});

