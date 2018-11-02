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

  Scenario: multiply register byte by register byte
    Given the program is:
      """
      al := 0x12                   ; assign 0x12 to al
      bl := 0x34                   ; assign 0x34 to bl
      bx := bl * al                ; multiply bl by al and assign result to bx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa8
      """
    When I run the program
    Then the program terminates with exit status 0xa8

  Scenario: multiply register word by register word
    Given the program is:
      """
      ax := 0x1234                 ; assign 0x1234 to ax
      bx := 0x5678                 ; assign 0x5678 to bx
      ebx := bx * ax               ; multiply bx by ax and assign result to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0x60
      """
    When I run the program
    Then the program terminates with exit status 0x60

  Scenario: multiply register double by register double
    Given the program is:
      """
      eax := 0xFEDC                ; assign 0xFEDC to eax
      ebx := 0xBA98                ; assign 0xBA98 to ebx
      ebx:edx := ebx * eax         ; multiply ebx by eax and assign result to ebx:edx
      ebx := edx                   ; assign the value of edx to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa0
      """
    When I run the program
    Then the program terminates with exit status 0xa0

  Scenario: multiply register double by register double with alternate register
    Given the program is:
      """
      eax := 0xFEDC                ; assign 0xFEDC to eax
      edx := 0xBA98                ; assign 0xBA98 to edx
      edx:eax := edx * eax         ; multiply edx by eax and assign result to edx:eax
      ebx := eax                   ; assign the value of eax to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa0
      """
    When I run the program
    Then the program terminates with exit status 0xa0

  Scenario: multiply register byte by memory
    Given the program is:
      """
      x := 0x12                    ; assign 0x12 to variable 'x'
      bl := 0x34                   ; assign 0x34 to bl
      bx := bl * x                 ; multiply bl by x and assign result to bx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0xa8
      """
    When I run the program
    Then the program terminates with exit status 0xa8

  Scenario: multiply register word by memory
    Given the program is:
      """
      x := 0x1234                  ; assign 0x1234 to variable 'x'
      bx := 0x5678                 ; assign 0x5678 to bx
      ebx := bx * x                ; multiply bx by x and assign result to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status 0x60
      """
    When I run the program
    Then the program terminates with exit status 0x60

  Scenario: multiply register double by memory
    Given the program is:
      """
      x := 0xFEDCBA98              ; assign 0xFEDCBA98 to variable 'x'
      ebx := 0x7654                ; assign 0x7654 to ebx
      ebx:edx := ebx * x           ; multiply ebx by x and assign result to ebx:edx
      ebx := edx                   ; assign the value of edx to ebx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status e0
      """
    When I run the program
    Then the program terminates with exit status 0xe0

  Scenario: multiply register double by memory with alternate register
    Given the program is:
      """
      x := 0xFEDCBA98              ; assign 0xFEDCBA98 to variable 'x'
      edx := 0x7654                ; assign 0x7654 to edx
      edx:eax := edx * x           ; multiply edx by x and assign result to edx:eax
      ebx := eax                   ; assign the value of eax to edx
      eax := 1                     ; assign 1 to eax
      syscall                      ; exit with status e0
      """
    When I run the program
    Then the program terminates with exit status 0xe0
