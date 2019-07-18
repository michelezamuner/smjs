Feature: Response endpoint service
  As a service client
  I want to access a response endpoint
  In order to get a response produced by the service behind that endpoint

  Scenario Outline: get a static response from an endpoint
    Given a response endpoint <type> for the "books/search" endpoint is added to the application
    And the application is started
    When I send a "format: json\n/books/search?searchText=text" input to the application twice in a row
    Then the '{"clientId":1234}' message is received twice
    And both client connections are closed

    Examples:
    | type   |
    | widget |
    | route  |