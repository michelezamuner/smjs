Feature: Terminate with exit status
  As a programmer
  I want my program to terminate with a specific exit status
  In order to give the OS information about the program execution

  Scenario: program is terminated with specific exit status
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

  Scenario: program is never terminated
    Given the program is:
      """
      eax := 5        ; assign 5 to eax
      ebx := eax      ; assign the value of eax to ebx
      """
    When I run the program
    Then the program terminates with exit status 127
    And the message "Missing exit instruction" is written to the standard error
