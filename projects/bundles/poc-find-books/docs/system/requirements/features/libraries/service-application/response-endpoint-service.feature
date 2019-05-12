Feature: Response endpoint service
  As a service client
  I want to access a response endpoint
  In order to get a response produced by the service behind that endpoint

  Scenario: get a static response from an endpoint
    Given a response endpoint widget for the "message" endpoint is added to the application
    And the application is started
    When I send a "/message" input to the application twice in a row
    Then the "response message" message is received twice
    And both client connections are closed
