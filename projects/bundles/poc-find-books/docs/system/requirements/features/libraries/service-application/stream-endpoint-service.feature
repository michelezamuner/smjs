Feature: Stream endpoint service
  As a service client
  I want to access a stream endpoint
  In order to receive multiple messages over the same connection

  Scenario: get messages streams to different connections from same endpoint
    Given a stream endpoint widget for the "stream" endpoint is added to the application
    And the application is started
    When I send a "/stream?id=1234" input to the application
    And I send a "/stream?id=4321" input to the application
    Then the first connection receives the messages "data11" and "data12"
    And the second connection receives the messages "data21" and "data22"
    And the two connections are closed

