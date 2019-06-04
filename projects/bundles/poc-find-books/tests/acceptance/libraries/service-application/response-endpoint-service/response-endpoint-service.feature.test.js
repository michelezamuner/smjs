const assertScript = require('../../../assert-script');

test('get a static response from an endpoint', async () => {
    const script = 'get-a-static-response-from-an-endpoint.sh';
    const args = ['books/search', `\$'format: json\n/books/search?searchText=text'`, '\'{\\"clientId\\":1234}\''];
    await assertScript(`${__dirname}/${script}`, args);
});
