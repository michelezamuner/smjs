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

  Scenario: jump if register equal to immediate
    Given the program is:
      """
      eax := 1                          ; assign 1 to eax
      ecx := 1                          ; assign 1 to ecx
      if ecx = 1                        ; compare ecx with 1
        goto exit                       ; goto 'exit' label if ecx is equal to 1
      eax := 5                          ; this instruction won't be executed
      exit:
      ebx := 1                          ; assign 1 to ebx
      syscall                           ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register equal to register
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 1                            ; assign 1 to edx
      if ecx = edx                        ; compare ecx with edx
        goto exit                         ; goto 'exit' label if ecx is equal to edx
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register equal to memory
    Given the program is:
      """
      x := 1                              ; assign 1 to x
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx = x                          ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is equal to x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register not equal to immediate
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx != 2                         ; compare ecx with 2
        goto exit                         ; goto 'exit' label if ecx is not equal to 2
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register not equal to register
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

  Scenario: jump if register not equal to memory
    Given the program is:
      """
      x := 2                              ; assign 2 to x
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx != x                         ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is not equal to x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register greater than immediate
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx > 0                          ; compare ecx with 0
        goto exit                         ; goto 'exit' label if ecx is greater than 0
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register greater than register
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

  Scenario: jump if register greater than memory
    Given the program is:
      """
      x := 0                              ; assign 0 to x
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx > x                          ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is greater than x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario jump if register greater than or equal to immediate
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx >= 0                         ; compare ecx with 0
        goto step                         ; goto 'step' label if ecx is greater than or equal to 0
      eax := 5                            ; this instruction won't be executed
      step:
      if ecx >= 1                         ; compare ecx with 1
        goto exit                         ; goto 'exit' label if ecx is greater than or equal to 1
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario jump if register greater than or equal to register
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      edx := 0                            ; assign 0 to edx
      if ecx >= edx                       ; compare ecx with edx
        goto step                         ; goto 'step' label if ecx is greater than or equal to edx
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

  Scenario jump if register greater than or equal to memory
    Given the program is:
      """
      x := 0                              ; assign 0 to x
      eax := 1                            ; assign 1 to eax
      ecx := 1                            ; assign 1 to ecx
      if ecx >= x                         ; compare ecx with x
        goto step                         ; goto 'step' label if ecx is greater than or equal to x
      eax := 5                            ; this instruction won't be executed
      step:
      x := 1                              ; assign 1 to x
      if ecx >= x                         ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is greater than or equal to x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register less than immediate
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      if ecx < 1                          ; compare ecx with 1
        goto exit                         ; goto 'exit' label if ecx is less than 1
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register less than register
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

  Scenario: jump if register less than memory
    Given the program is:
      """
      x := 1                              ; assign 1 to x
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      if ecx < x                          ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is less than x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register less than or equal to immediate
    Given the program is:
      """
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      if ecx <= 1                         ; compare ecx with 1
        goto step                         ; goto 'step' label if ecx is less than or equal to 1
      eax := 5                            ; this instruction won't be executed
      step:
      if ecx <= 0                         ; compare ecx with 0
        goto exit                         ; goto 'exit' label if ecx is less than or equal to 0
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1

  Scenario: jump if register less than or equal to register
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

  Scenario: jump if register less than or equal to memory
    Given the program is:
      """
      x := 1                              ; assign 1 to x
      eax := 1                            ; assign 1 to eax
      ecx := 0                            ; assign 0 to ecx
      if ecx <= x                         ; compare ecx with x
        goto step                         ; goto 'step' label if ecx is less than or equal to x
      eax := 5                            ; this instruction won't be executed
      step:
      x := 0                              ; assign 0 to x
      if ecx <= x                         ; compare ecx with x
        goto exit                         ; goto 'exit' label if ecx is less than or equal to x
      eax := 5                            ; this instruction won't be executed
      exit:
      ebx := 1                            ; assign 1 to ebx
      syscall                             ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 1
