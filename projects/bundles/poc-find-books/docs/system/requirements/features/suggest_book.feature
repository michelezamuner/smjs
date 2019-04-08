Feature: Suggest book
  As a user
  I want to be able to send the ID of a book to different recipients
  In order to suggest a book to friends

  Scenario: suggest a book via email and SMS
    Given the book with ID "1" exists
    And the suggest target "email:me@something.com" is selected
    And the suggest target "sms:1234567" is selected
    When I suggest the book ID "1" to the selected targets
    Then an email is sent to "me@something.com" containing the book ID "1"
    And an SMS is sent to "1234567" containing the book ID "1"

  Scenario: fails if sending invalid book ID
    Given the suggest target "email:me@something.com" is selected
    When I suggest the book ID "invalid" to the selected targets
    Then a "invalid book" error is received

  Scenario: fails if sending suggestion with no selected targets
    Given the book with ID "1" exists
    And no suggest target is selected
    When I suggest the book ID "1" to the selected targets
    Then a "no targets" error is received

  Scenario Outline: fails if sending suggestion with invalid targets
    Given the book with ID "1" exists
    And the suggest target "<target>" is selected
    When I suggest the book ID "1" to the selected targets
    Then a "invalid target" error is received

    Examples:
      | target              |
      | email:invalid-email |
      | sms:invalid-number  |

  Scenario: fails in case of error sending the suggestion
    Given the suggestions sender is not working
    And the book with ID "1" exists
    And the suggest target "email:me@something.com" is selected
    When I suggest the book ID "1" to the selected targets
    Then a "suggest error" error is received
