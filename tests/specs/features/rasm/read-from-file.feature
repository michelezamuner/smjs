Feature: Read from file
  As a programmer
  I want to be able to read from files
  In order to use the OS features related to files

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
