Feature: Tags
  As a PHP programmer
  I want to use block tags and echo tags
  In order to embed PHP code inside a text

  Scenario: text with no PHP block tag is printed to the standard output
    Given the code is:
      """
      Some text with no PHP tag
      """
    When I compile and run the program
    Then the text 'Some text with no PHP tag' is printed

  Scenario: print PHP output from multiple block tags
    Given the code is:
      """
      Some <?php echo 'use' ?> of <?php echo 'PHP' ?> block <?php echo 'tags' ?>
      """
    When I compile and run the program
    Then the text 'Some use of PHP block tags' is printed

  Scenario: print text with the echo tag
    Given the code is:
      """
      Some <?= 'use' ?> of <?= 'PHP' ?> echo <?= 'tags' ?>
      """
    When I compile and run the program
    Then the text 'Some use of PHP echo tags' is printed

  Scenario: can avoid closing last block
    Given the code is:
      """
      Some use of <?php echo 'PHP block tags'
      """
    When I compile and run the program
    Then the text 'Some use of PHP block tags' is printed
