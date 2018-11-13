Feature: Syscalls
  As a programmer
  I want to be able to make syscalls
  In order to use the underlying operating system features

  Scenario: program is terminated with specific exit status
    Given the program is:
      """
      eax := 1        ; assign 1 to eax (sys_write)
      ebx := 5        ; assign 5 to ebx (exit status)
      ecx := 3        ; assign 3 to ecx
      syscall         ; exit with status 5
      eax := 1        ; following instructions aren't interpreted
      ebx := 4
      syscall
      """
    When I run the program
    Then the program terminates with exit status 5

  Scenario: an error happens if program is never terminated
    Given the program is:
      """
      eax := 5        ; assign 5 to eax
      ebx := eax      ; assign the value of eax to ebx
      """
    When I run the program
    Then the program terminates with exit status 127
    And the message "Missing exit instruction" is written to the standard error

  Scenario: print message to the standard output
    Given the program is:
      """
      message := "Hello, World!"  ; assign "Hello, World!" to variable 'message'
      eax := 4                    ; assign 4 to eax (sys_write)
      ebx := 1                    ; assign 1 to ebx (stdout)
      ecx := message              ; assign 'message' to ecx (buffer address)
      edx := 13                   ; assign 13 to edx (number of bytes to write)
      syscall                     ; write the given buffer size to the stdout
      ebx := eax                  ; store the number of bytes written into ebx
      eax := 1
      syscall                     ; exit with number of written bytes as exit status
      """
    When I run the program
    Then the program terminates with exit status 13
    And the message "Hello, World!" is written to the standard output

  Scenario: read value from the standard input
    Given the program is:
      """
      input :=                  ; declare the variable 'input' without initializing it
      eax := 3                  ; assign 2 to eax (sys_read)
      ebx := 0                  ; assign 0 to ebx (stdin)
      ecx := &input             ; assign to ecx the address of 'input' (buffer address)
      edx := 1                  ; assign 1 to edx (number of bytes to read)
      syscall                   ; read the given number of bytes to the given buffer from stdin
      ebx := input              ; assign the value of 'input' to ebx
      eax := 1                  ; assign 1 to eax (sys_exit)
      syscall                   ; exit with the number inserted by the user
      """
    When I run the program
    And I pass the character '#' to the standard input
    Then the program terminates with exit status 35
