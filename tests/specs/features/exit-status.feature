Feature: Exit status
  As a programmer
  I want to write a program that terminates with an exit status
  In order to communicate to the operating system the status at program termination

  Scenario: program terminates with specific exit status
    Given the program (pseudocode) is:
      """
      eax := 1
      ebx := 5
      exc := 3
      syscall
      eax := 1
      ebx := 4
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: program is not terminated by an exit instruction
    Given the program (pseudocode) is:
      """
      eax := 5
      ebx := eax
      """
    When I run the program
    Then the program terminates with exit status 1
    And the standard error contains the message "Missing exit instruction"
