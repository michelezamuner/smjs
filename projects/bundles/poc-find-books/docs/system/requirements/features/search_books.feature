Feature: Search books
  As a user
  I want to be able to search books
  In order to find books I'm interested to

  Scenario Outline: find books containing search text
    Given a book exists containing "<first_match>"
    And a book exists containing "<second_match>"
    When I search books containing "<search>"
    Then the book ID "<first_id>" is returned first
    And the book ID "<second_id>" is returned last

    Examples:
      | search | first_id | first_match | second_id | second_match |
      | dog    | 1        | my dog      | 2         | your dog     |
      | ball   | 3        | pretty ball | 1         | ball falls   |

  Scenario Outline: fails if using invalid search text
    When I search books containing "<search>"
    Then a "<error>" error is received

    Examples:
      | search | error              |
      |        | too short          |
      | a      | too short          |
      | /%-    | invalid characters |

  Scenario: fails in case of error performing the search
    Given the search engine is not available
    When I search books containing "something"
    Then a "search error" error is received
