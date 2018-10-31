Feature: Multiply numbers
  As a programmer
  I want to be able to multiply numbers
  In order to be able to perform calculations

  Scenario: multiply register byte by immediate byte
    Given the program is:
      """
      al := 0x12                   ; assign 0x12 to al
      ax := al * 0x32              ; multiply al by 0x32 and assign result to ax
      bx := ax                     ; assign result stored in ax to bx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa8
      """
    When I run the program
    Then the program terminates with exit status 0xa8

  Scenario: multiply register word by immediate word
    Given the program is:
      """
      bx := 0x1234                 ; assign 0x1234 to bx
      ebx := bx * 0x5678           ; multiply bx by 0x5678 and assign result to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0x60
      """
    When I run the program
    Then the program terminates with exit status 0x60

  Scenario: multiply register double by immediate word
    Given the program is:
      """
      ebx := 0xFEDC                ; assign 0xFEDC to ebx
      ebx:edx := ebx * 0xBA98      ; multiply ebx by 0xBA98 and assign result to ebx:edx
      eax := 1                     ; assign 1 to eax
      ebx := edx                   ; assign to ebx the value of edx
      syscall                      ; exit with status 0xa0
      """
    When I run the program
    Then the program terminates with exit status 0xa0

  Scenario: multiply register double by immediate word with alternate register
    Given the program is:
      """
      edx := 0xFEDC                ; assign 0xFEDC to edx
      edx:eax := edx * 0xBA98      ; multiply edx by 0xBA98 and assign result to edx:eax
      ebx := eax                   ; assign to ebx the value of eax
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa0
      """
    When I run the program
    Then the program terminates with exit status 0xa0