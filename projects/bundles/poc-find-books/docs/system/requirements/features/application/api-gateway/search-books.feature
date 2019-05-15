Feature: Search books
  As a client
  I want to be able to call the search books endpoint
  In order to use the search books feature

  Scenario: search endpoint assigns search IDs
    Given the search books service is running
    And the API gateway is running
    When I call the search endpoint with search text "search1"
    And I call the search endpoint with search text "search2"
    Then the search ID "1234" is returned from the first call
    And the search ID "4321" is returned from the second call

  Scenario: get data from search results endpoint
    Given the search books service is running
    And the API gateway is running
    When I call the search output endpoint with ID "1234"
    Then a stream connection is opened
    And the data "book1" is sent
    And the data "book2" is sent
    And the connection is closed

