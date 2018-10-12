Feature: Instruction mov
  As a programmer
  I want to move data from one storage to another
  In order to be able to work with data in a program

  Scenario: move register to register
    Given the program is:
        """
        eax := 1                       ; assign 1 to eax
        ecx := 4                       ; assign 4 to ecx
        ebx := ecx                     ; assign ecx to ebx
        syscall                        ; exit with status 4
        """
    When I run the program
    Then the program terminates with exit status 4

  Scenario: move immediate to register
    Given the program is:
      """
      eax := 1                         ; assign 1 to eax
      ebx := 5                         ; assign 5 to ebx
      syscall                          ; exit with status 5
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: move immediate to memory
    Given the program is:
        """
        status :=                      ; declare variable 'status' without initializing it
        eax := 1                       ; assign 1 to eax
        status := 0x54                 ; assign 0x54 to 'status'
        ebx := status                  ; assign the value of 'status' to ebx
        syscall                        ; exit with status 0x54
        """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move immediate to register pointer
    Given the program is:
      """
      status :=                        ; declare variable 'status' without initializing it
      eax := 1                         ; assign 1 to eax
      cx := &status                    ; let cx point to 'status'
      *cx := 0x54                      ; assign 0x54 to the variable pointed to by cx
      ebx := status                    ; assign value of variable 'status' to ebx
      syscall                          ; exit with status 0x54
      """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move immediate to memory pointer
    Given the program is:
      """
      status :=                        ; declare variable 'status' without initializing it
      statusPtr := &status             ; let variable 'statusPtr' point to 'status'
      *statusPtr := 0x54               ; assign the value 0x54 to the variable pointed to by 'statusPtr'
      eax := 1                         ; assign 1 to eax
      ebx := status                    ; assign to ebx the value of 'status'
      syscall                          ; exit with status 0x54
      """
    When I run the program
    Then the program terminates with exit status 0x54

  Scenario: move memory to register
    Given the program is:
      """
      exit := 1                        ; assign 1 to variable 'exit'
      status := 0xA2                   ; assign 0xA2 to variable 'status'
      eax := exit                      ; assign value of variable 'exit' to eax
      ebx := status                    ; assign value of variable 'status' to ebx
      syscall                          ; exit with status 0xA2
      """
    When I run the program
    Then the program terminates with exit status 0xA2

  Scenario: move register pointer to register
    Given the program is:
      """
      status := 0xA2                   ; assign 0xA2 to variable 'status'
      eax := 1                         ; assign 1 to eax
      cx := &status                    ; let cx point to 'status'
      ebx := *cx                       ; assign the value pointed to by cx to ebx
      syscall                          ; exit with status 0xA2
      """
    When I run the program
    Then the program terminates with exit status 0xA2

  Scenario: move register to memory
    Given the program is:
      """
      eax := 1                         ; assign 1 to eax
      ecx := 0xFE                      ; assign 0xFE to ecx
      status := ecx                    ; assign the value of ecx to variable 'status'
      ebx := status                    ; assign the value of 'status' to ebx
      syscall                          ; exit with status 0xFE
      """
    When I run the program
    Then the program terminates with exit status 0xFE

  Scenario: move register to register pointer
    Given the program is:
      """
      status :=                        ; declare variable 'status' without initializing it
      eax := 1                         ; assign 1 to eax
      ecx := 0xFE                      ; assign 0xFE to ecx
      dx := &status                    ; let dx point to 'status'
      *dx := ecx                       ; assign the value of ecx to the variable pointed to by dx
      ebx := status                    ; assign the value of 'status' to ebx
      syscall                          ; exit with status 0xFE
      """
    When I run the program
    Then the program terminates with exit status 0xFE

  Scenario: move register to memory pointer
    Given the program is:
      """
      status :=                        ; declare variable 'status' without initializing it
      statusPtr := &status             ; let variable 'statusPtr' point to 'status'
      eax := 1                         ; assign 1 to eax
      ecx := 0xFE                      ; assign 0xFE to ecx
      *statusPtr := ecx                ; assign the value of ecx to the variable pointed to by 'statusPtr'
      ebx := status                    ; assign the value of 'status' to ebx
      syscall                          ; exit with status 0xFE
      """
    When I run the program
    Then the program terminates with exit status 0xFE

  Scenario: move from table
    Given the program is:
      """
      table := [1, 2, 3, 4]            ; assign a table of values to the variable 'table'
      eax := table[0]                  ; assign the first value of 'table' to eax
      ebx := table[1]                  ; assign the second value of 'table' to ebx
      ecx := table[2]                  ; assign the third value of 'table' to ecx
      edx := table[3]                  ; assign the fourth value of 'table' to edx
      syscall                          ; exit with status 2

      """
    When I run the program
    Then the program terminates with exit status 2

  Scenario: move to table
    Given the program is:
      """
      table := [](3)                   ; declare table of 3 elements 'table', without initializing it
      table[0] := 1                    ; assign 1 to the first element of 'table'
      table[1] := 2                    ; assign 2 to the second element of 'table'
      table[2] := 0x93                 ; assign 0x93 to the third element of 'table'
      eax := table[0]                  ; assign the first element of 'table' to eax
      ebx := table[2]                  ; assign the third element of 'table' to ebx
      syscall                          ; exit with status 0x93
      """
    When I run the program
    Then the program terminates with exit status 0x93

  Scenario: move immediate characters
    Given the program is:
      """
      eax := 1                         ; assign 1 to eax
      ebx := '?'                       ; assign the character '?' to ebx
      syscall                          ; exit with status 63
      """
    When I run the program
    Then the program terminates with exit status 63

