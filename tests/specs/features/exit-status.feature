Feature: Exit status
  As a programmer
  I want to write a program that terminates with an exit status
  In order to communicate to the operating system the status at program termination

  Scenario: program terminates with specific exit status
    Given the program (pseudocode) is:
      """
      al := 1        ; assign 1 to al
      bl := 5        ; assign 5 to bl
      cl := 3        ; assign 3 to cl
      syscall        ; exit with status 5
      al := 1        ; following instructions aren't interpreted
      bl := 4
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: program is not terminated by an exit instruction
    Given the program (pseudocode) is:
      """
      al := 5        ; assign 5 to al
      bl := al       ; assign the value of al to bl
      """
    When I run the program
    Then the program terminates with exit status 1
    And the standard error contains the message "Missing exit instruction"
