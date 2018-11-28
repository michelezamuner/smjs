Feature: Procedures
  As a programmer
  I want to use procedures
  In order to better organize code

  Scenario: Call procedure with no parameters and that does not return
    Given the program is:
      """
      exit:
        eax := 1                  ; assign 1 to eax
        ebx := 1                  ; assign 1 to ebx
        syscall                   ; exit with status 1

      call exit                   ; call 'exit' procedure
      eax := 1                    ; this instruction will never be executed
      ebx := 2                    ; this instruction will never be executed
      syscall                     ; this instruction will never be executed
      """
    When I run the program
    Then the program terminates with exit status 0x01

  Scenario: Call procedure with no parameters and no return value
    Given the program is:
      """
      set_exit_status:
        ebx := 1                  ; assign 1 to ebx
        ret

      eax := 1                    ; assign 1 to eax
      call set_exit_status        ; call 'set_exit_status' procedure
      syscall                     : exit with status 1
      """
    When I run the program
    Then the program terminates with exit status 0x01
