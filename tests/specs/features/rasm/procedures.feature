Feature: Procedures
  As a programmer
  I want to use procedures
  In order to better organize code

  Scenario: Call procedure with no arguments and that does not return
    Given the program is:
      """
      exit:
        eax := 1                  ; assign 1 to eax
        ebx := 1                  ; assign 1 to ebx
        syscall                   ; exit with status 1

      exit()                      ; call 'exit' procedure
      eax := 1                    ; this instruction will never be executed
      ebx := 2                    ; this instruction will never be executed
      syscall                     ; this instruction will never be executed
      """
    When I run the program
    Then the program terminates with exit status 0x01

  Scenario: Call procedure with no arguments and no return value
    Given the program is:
      """
      set_exit_status:
        ebx := 1                  ; assign 1 to ebx
        return

      eax := 1                    ; assign 1 to eax
      set_exit_status()           ; call 'set_exit_status' procedure
      syscall                     ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 0x01

  Scenario: Call procedure with no arguments and immediate return value
    Given the program is:
      """
      get_exit_status:
        return 1

      eax := 1                    ; assign 1 to eax
      ebx := get_exit_status()    ; call 'get_exit_status' procedure, and assign return value to ebx
      syscall                     ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 0x01

  Scenario: Call procedure with no arguments and register return value
    Given the program is:
      """
      get_exit_status:
        ecx := 1                  ; assign 1 to ecx
        return ecx                ; return the value of ecx

      eax := 1                    ; assign 1 to eax
      ebx := get_exit_status()    ; call 'get_exit_status' procedure, and assign return value to ebx
      syscall                     ; exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 0x01

  Scenario: Call procedure with no arguments and memory return value
    Given the program is:
      """
      exit_status := 1          ; assign 1 to 'exit_status' variable

      get_exit_status:
        return exit_status      ; return the value of 'exit_status' variable

      eax := 1                  ; assign 1 to eax
      ebx := get_exit_status()  ; call 'get_exit_status' procedure, and assign return value to ebx
      syscall                   ; exit with status 1
      """

  Scenario: Call procedure with arguments and return value
    Given the program is:
      """
      arg3 := 3                 ; assign 3 to 'arg3' variable

      get_exit_status(a, b, c):
        edx := 0                ; initialize edx to 0
        edx += a                ; add a to edx
        edx += b                ; add b to edx
        edx += c                ; add c to edx

        return edx              ; return the result of the sum

      eax := 2                  ; assign 2 to eax
      ; call 'get_exit_status' procedure, passing immediate, register and memory arguments, and assign result to ebx
      ebx := get_exit_status(1, eax, arg3)

      eax := 1                  ; assign 1 to eax
      syscall                   ; exit with status 6
      """
