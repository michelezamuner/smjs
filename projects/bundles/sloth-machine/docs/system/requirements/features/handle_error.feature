Feature: Handle error
  As an application adapter
  I want to be able to handle every kind of error
  In order to prevent the application from crashing

  Scenario: a fatal error in the architecture is caught and a user friendly error message is displayed
    Given the default architecture generates a fatal error
    When I run the program
    Then the virtual machine terminates with exit status 127
    And the message "A fatal error happened in the application" is written to the standard error
