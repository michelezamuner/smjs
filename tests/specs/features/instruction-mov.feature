Feature: Instruction mov
  As a programmer
  I want to move data from one storage to another
  In order to be able to work with data in a program

  Scenario: move register to register
    Given the program (pseudocode) is:
        """
        al := 1                       ; assign 1 to al
        cl := 4                       ; assign 4 to cl
        bl := cl                      ; assign cl to bl
        syscall                       ; exit with status 4
        """
    When I run the program
    Then the program terminates with exit status 4

  Scenario: move immediate to register
    Given the program (pseudocode) is:
      """
      al := 1                         ; assign 1 to al
      bl := 5                         ; assign 5 to bl
      syscall                         ; exit with status 5
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: move immediate to memory
    Given the program (pseudocode) is:
        """
        status :=                     ; declare variable 'status' without initializing it
        al := 1                       ; assign 1 to al
        status := 0x54                ; assign 0x54 to 'status'
        bl := status                  ; assign the value of 'status' to bl
        syscall                       ; exit with status 0x54
        """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move immediate to register pointer
    Given the program (pseudocode) is:
      """
      status :=                       ; declare variable 'status' without initializing it
      al := 1                         ; assign 1 to al
      cl := &status                   ; let cl point to 'status'
      *cl := 0x54                     ; assign 0x54 to the variable pointed to by cl
      bl := status                    ; assign value of variable 'status' to bl
      syscall                         ; exit with status 0x54
      """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move immediate to memory pointer
    Given the program (pseudocode) is:
      """
      status :=                       ; declare variable 'status' without initializing it
      statusPtr := &status            ; let variable 'statusPtr' point to 'status'
      *statusPtr := 0x54              ; assign the value 0x54 to the variable pointed to by 'statusPtr'
      al := 1                         ; assign 1 to al
      bl := *statusPtr                ; assign to bl the value in memory pointed to by exitPtr
      syscall                         ; exit with status 0x54
      """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move memory to register
    Given the program (pseudocode) is:
      """
      exit := 1                       ; assign 1 to variable 'exit'
      status := 0xA2                  ; assign 0xA2 to variable 'status'
      al := exit                      ; assign value of variable 'exit' to al
      bl := status                    ; assign value of variable 'status' to bl
      syscall                         ; exit with status 0xA2
      """
    When I run the program
    Then the program terminates with exit status 0xA2

  Scenario: move register pointer to register
    Given the program (pseudocode) is:
      """
      status := 0xA2                  ; assign 0xA2 to variable 'status'
      al := 1                         ; assign 1 to al
      cx := &status                   ; let cx point to 'status'
      bl := *cx                       ; assign the value pointed to by cx to bl
      syscall                         ; exit with status 0xA2
      """
    When I run the program
    Then the program terminates with exit status 0xA2

  Scenario: move memory pointer to register
    Given the program (pseudocode) is:
      """
      status := 0xA2                  ; assign 0xA2 to variable 'status'
      statusPtr := &status            ; let variable 'statusPtr' point to 'status'
      al := 1                         ; assign 1 to al
      bl := *statusPtr                ; assign the value pointed to by statusPtr to bl
      syscall                         ; exit with status 0xA2
      """

  Scenario: move register to memory
    Given the program (pseudocode) is:
      """
      al := 1                         ; assign 1 to al
      cl := 0xFE                      ; assign 0xFE to cl
      status := cl                    ; assign the value of cl to variable 'status'
      bl := status                    ; assign the value of 'status' to bl
      syscall                         ; exit with status 0xFE
      """
    When I run the program
    Then the program terminates with exit status 0xFE

  Scenario: move register to register pointer
    Given the program (pseudocode) is:
      """
      status :=                       ; declare variable  'status' without initializing it
      al := 1                         ; assign 1 to al
      cl := 0xFE                      ; assign 0xFE to cl
      dl := &status                   ; let dl point to 'status'
      *dl := cl                       ; assign the value of cl to the variable pointed to by dl
      bl := status                    ; assign the value of 'status' to bl
      syscall                         ; exit with status 0xFE
      """
    When I run the program
    Then the pgroam terminates with exit status 0xFE
