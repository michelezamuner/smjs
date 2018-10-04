Feature: Instruction mov
  As a programmer
  I want to move data from one storage to another
  In order to be able to work with data in a program

  Scenario: move with immediate addressing
    Given the program (pseudocode) is:
      """
      eax := 1
      ebx := 5
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

    Scenario: move with register addressing
      Given the program (pseudocode) is:
        """
        eax := 1
        exc := 4
        ebx := ecx
        syscall
        """
      When I run the program
      Then the program terminates with exit status 4

    Scenario: move with direct memory addressing
      Given the program (pseudocode) is:
        """
        exit := 0x01
        status := 0xFE
        eax := exit
        ebx := status
        syscall
        """
      When I run the program
      Then the program terminates with exit status 254
