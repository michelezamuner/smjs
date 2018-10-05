Feature: Instruction mov
  As a programmer
  I want to move data from one storage to another
  In order to be able to work with data in a program

  Scenario: move to register with immediate addressing
    Given the program (pseudocode) is:
      """
      eax := 1      ; assign 1 to eax
      ebx := 5      ; assign 5 to ebx
      syscall       ; exit with status 5
      """
    When I run the program
    Then the program terminates with exit status 5

    Scenario: move to register with register addressing
      Given the program (pseudocode) is:
        """
        eax := 1      ; assign 1 to eax
        exc := 4      ; assign 4 to ecx
        ebx := ecx    ; assign ecx to ebx
        syscall       ; exit with status 4
        """
      When I run the program
      Then the program terminates with exit status 4

    Scenario: move to register with direct memory addressing
      Given the program (pseudocode) is:
        """
        exit := 1         ; assign 1 to variable 'exit'
        status := 0xA2    ; assign 0xA2 to variable 'status'
        eax := exit       ; assign value of variable 'exit' to eax
        ebx := status     ; assign value of variable 'status' to ebx
        syscall           ; exit with status 0xA2
        """
      When I run the program
      Then the program terminates with exit status 0xA2

    Scenario: move to memory with immediate addressing
      Given the program (pseudocode) is:
        """
        status :=         ; define 'status' without initializing it
        eax := 1          ; assign 1 to eax
        status := 0x54    ; assign 0x54 to 'status'
        ebx := status     ; assign the value of 'status' to ebx
        syscall           ; exit with status 0x54
        """
      When I run the program
      Then the program terminates with exit status 0x54

    Scenario: move to memory with direct memory addressing
      Given the program (pseudocode) is:
        """
        status :=         ; define 'status' without initializing it
        eax := 1          ; assign 1 to eax
        ecx := 0xFE       ; assign 0xFE to ecx
        status := ecx     ; assign the value of ecx to 'status'
        ebx := status     ; assign the value of 'status' to ebx
        syscall           ; exit with status 0xFE
        """
      When I run the program
      Then the program terminates with exit status 0xFE
