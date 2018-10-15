const expect = require('./expect');

test('text with no PHP block tag is printed to the standard output', () => {
    return expect.program(`
<!doctype html>
<html>
    <head>
        <title>Sloth Machine</title>
    </head>
</html>
    `).toExitWith(0, `
<!doctype html>
<html>
    <head>
        <title>Sloth Machine</title>
    </head>
</html>
    `);
});

test('print PHP output from multiple block tags', () => {
    return expect
        .program(`Some <?php echo 'use' ?> of <?php echo 'PHP' ?> block <?php echo 'tags' ?>`)
        .toExitWith(0, `Some use of PHP block tags`);
});
