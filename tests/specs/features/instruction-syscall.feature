Feature: Exit status
  As a programmer
  I want to write a program that terminates with an exit status
  In order to communicate to the operating system the status at program termination

  Scenario: call sys_exit with specific exit status
    Given the program is:
      """
      eax := 1        ; assign 1 to eax (sys_write)
      ebx := 5        ; assign 5 to ebx (exit status)
      ecx := 3        ; assign 3 to ecx
      syscall         ; exit with status 5
      eax := 1        ; following instructions aren't interpreted
      ebx := 4
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: sys_exit is never called
    Given the program is:
      """
      eax := 5        ; assign 5 to eax
      ebx := eax      ; assign the value of eax to ebx
      """
    When I run the program
    Then the program terminates with exit status 1
    And the message "Missing exit instruction" is written to the standard error

  Scenario: call sys_write to print to STDOUT
    Given the program is:
      """
      message db  "Hello, World!"
      eax := 4        ; assign 4 to eax (sys_write)
      ebx := 1        ; assign 1 to ebx (stdout)
      ecx := message  ; assign variable 'message' to ecx (buffer address)
      edx := 13       ; assign 13 to edx (number of bytes to write)
      syscall         ; write the given buffer size to the stdout
      ebx := eax      ; store the number of bytes written into ebx
      eax := 1
      syscall
      """
    When I run the program
    Then the program terminates with exit status 13
    And the message "Hello, World!" is written to the standard output
