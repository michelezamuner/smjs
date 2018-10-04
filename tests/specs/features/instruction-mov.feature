Feature: Instruction mov
  As a programmer
  I want to move data from one storage to another
  In order to be able to work with data in a program

  Scenario: move with immediate addressing
    Given the program (pseudocode) is:
      """
      eax := 1      ; assign 1 to eax
      ebx := 5      ; assign 5 to ebx
      syscall       ; exit with status 5
      """
    When I run the program
    Then the program terminates with exit status 5

    Scenario: move with register addressing
      Given the program (pseudocode) is:
        """
        eax := 1      ; assign 1 to eax
        exc := 4      ; assign 4 to ecx
        ebx := ecx    ; assign ecx to ebx
        syscall       ; exit with status 4
        """
      When I run the program
      Then the program terminates with exit status 4

    Scenario: move with direct memory addressing
      Given the program (pseudocode) is:
        """
        exit := 1         ; assign 1 to 'exit'
        status :=         ; define 'status' without initializing it
        eax := exit       ; assign the value of 'exit' to eax
        ecx := 0xFE       ; assign 0xFE to ecx
        status := ecx     ; assign the value of ecx to 'status'
        ebx := status     ; assign the value of 'status' to ebx
        syscall           ; exit with status 0xFE
        """
      When I run the program
      Then the program terminates with exit status 254
