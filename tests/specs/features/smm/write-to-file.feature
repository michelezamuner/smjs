Feature: Write to file
  As a programmer
  I want to be able to write to files
  In order to use the OS features related to files

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
