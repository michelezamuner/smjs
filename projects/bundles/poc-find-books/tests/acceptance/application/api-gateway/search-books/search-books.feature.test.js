const assertScript = require('../../../assert-script');

test.skip('search endpoint assigns search IDs', async () => {
    const script = 'search-endpoint-assigns-search-IDs.sh';
    const args = ['search1', 'search2', '1234', '4321'];
    await assertScript(`${__dirname}/${script}`, args);
});

test.skip('get data from search results endpoint', async () => {
    const script = 'get-data-from-search-results-endpoint.sh';
    const args = ['1234', 'book1', 'book2'];
    await assertScript(`${__dirname}/${script}`, args);
});
