Feature: Handle error
  As an application adapter
  I want to be able to handle every kind of error
  In order to prevent the application from crashing

  Scenario: a fatal error in the architecture is caught and it is displayed
    Given the default architecture generates a fatal error "Fatal error: abcd is not defined"
    When I run the program
    Then the virtual machine terminates with exit status 127
    And the message "Fatal error: abcd is not defined" is written to the standard error
