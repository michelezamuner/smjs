Feature: Conditionals
  As a programmer
  I want to use conditional instructions
  In order to control program flow

  Scenario: jump unconditionally
    Given the program is:
      """
      eax := 1                          ; assign 1 to eax
      goto exit                         ; jump to the instruction with the 'exit' label
      eax := 5                          ; this instruction won't be executed
      exit:
      ebx := 1                          ; assign 1 to ebx
      syscall                           ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if equal
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 1                            ; assign 1 to edx
      if ecx == edx                       ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is equal to edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if not equal
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 2                            ; assign 2 to edx
      if ecx != edx                       ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is not equal to edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if greater
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 0                            ; assign 0 to edx
      if ecx > edx                        ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is greater than edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario jump if greater or equal
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 0                            ; assign 0 to edx
      if ecx >= edx                       ; compare ecx with edx
        goto step                         ; goto 'step' label if ecx is greater or equal than edx
      eax := 5                            ; this instruction won't be executed
      step:
      edx := 1                            ; assign 1 to edx
      if ecx >= edx                       ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is greater than or equal to edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if less
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      edx := 1                            ; assign 1 to edx
      if ecx < edx                        ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is less than edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if less or equal
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      edx := 1                            ; assign 1 to edx
      if ecx <= edx                       ; compare ecx with edx
        goto step                         ; goto 'step' label if ecx is less than or equal to edx
      eax := 5                            ; this instruction won't be executed
      step:
      edx := 0                            ; assign 0 to edx
      if ecx <= edx                       ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is less than or equal to edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1
