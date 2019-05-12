const assertScript = require('./assert-script');

test.skip('find books containing search text with console command', async () => {
    const parameters = [
        { search: 'dog', expected: "12" },
        { search: 'ball', expected: "31" },
    ];
    for (const { search, expected } of parameters) {
        const script = `find-books-containing-search-text-with-console-command.sh`;
        const args = [search, expected];
        await assertScript(`${__dirname}/${script}`, args);
    }
});

test.skip('find books containing search text with finder service', async () => {
    // start integration bus
    // use find books service
});
