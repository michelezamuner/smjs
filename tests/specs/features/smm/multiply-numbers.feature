Feature: Multiply numbers
  As a programmer
  I want to be able to multiply numbers
  In order to be able to perform calculations

  Scenario: multiply register byte by immediate byte
    Given the program is:
      """
      al := 0x12                   ; assign 0x12 to eax
      al := al * 0x32              ; multiply al by 0x32 and assign result to ax
      bx := ax                     ; assign result stored in ax to bx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa8
      """
    When I run the program
    Then the program terminates with exit status 0xa8


