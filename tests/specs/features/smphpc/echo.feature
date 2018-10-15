Feature: Echo
  As a programmer
  I want to print text to the standard output with the "echo" construct
  In order for it to be used by the client

  Scenario: use echo with single string
    Given the code is:
      """
      <?php
      echo 'Hello, World!';
      """
    When I compile and run the program
    Then The text 'Hello, World!' is printed

  Scenario: use echo with single string and parenthesis
    Given the code is:
      """
      <?php
      echo('Hello, World!');
      """
    When I compile and run the program
    Then the text 'Hello, World! is printed

  Scenario: use echo with multiple strings
    Given the code is:
      """
      <?php
      echo 'Hello', ',', 'World!';
      """
    When I compile and run the program
    Then the text 'Hello, World!' is printed
