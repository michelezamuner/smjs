Feature: Endpoint service
  As a developer
  I want to build a service application exposing an endpoint
  In order to provide services to clients on that endpoint

  Scenario: get a static message from an endpoint
    Given an endpoint widget for the "message" endpoint is added to the application
    And the application is started
    When I send a "/message" input to the application twice in a row
    Then the "response message" message is received twice
    And both client connections are closed
