Feature: Exit status
  As a programmer
  I want to write a program that terminates with an exit status
  In order to communicate to the operating system the status at program termination

  Scenario: program terminates with specific exit status
    Given the program (pseudocode) is:
      """
      eax := 1        ; assign 1 to eax
      ebx := 5        ; assign 5 to ebx
      ecx := 3        ; assign 3 to ecx
      syscall         ; exit with status 5
      eax := 1        ; following instructions aren't interpreted
      ebx := 4
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: program is not terminated by an exit instruction
    Given the program (pseudocode) is:
      """
      eax := 5        ; assign 5 to eax
      ebx := eax      ; assign the value of eax to ebx
      """
    When I run the program
    Then the program terminates with exit status 1
    And the standard error contains the message "Missing exit instruction"
