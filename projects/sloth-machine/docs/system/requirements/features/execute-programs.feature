Feature: Execute programs
  As a programmer
  I want to be able to execute programs
  In order to perform computations

  Scenario: an error is returned if an unsupported architecture is selected
    Given the "unsupported" architecture is selected
    When I run the virtual machine
    Then the virtual machine terminates with exit status 127
    And the message "Unsupported architecture "unsupported"" is written to the standard error

  Scenario: an error is returned if no program file is passed
    Given no program file is passed
    When I run the virtual machine
    Then the virtual machine terminates with exit status 127
    And the message "No program file given" is written to the standard error

  Scenario: an error is returned if an invalid program file is passed
    Given an invalid program file is passed
    When I run the virtual machine
    Then the virtual machine terminates with exit status 127
    And the message "Invalid program file given" is written to the standard error

  Scenario: execute sample program with default architecture SMA
    Given the program is:
      """
      message := "Hello, World!"
      eax := 4 ; sys_write
      ebx := 1 ; STDOUT
      ecx := &message
      edx := 13 ; bytes to write
      syscall
      ebx := eax ; bytes written
      eax := 1
      syscall
      """
    When I run the program
    Then the virtual machine terminates with exit status 13
    And the message "Hello, World!" is written to the standard output

  Scenario: execute sample program with alternative architecture
    Given the "test" architecture is selected
    And the program is:
      """
      print "Hello, World!"
      """
    When I run the program
    Then the virual machine terminates with exit status 0
    And the message "Hello, World!" is written to the standard output
