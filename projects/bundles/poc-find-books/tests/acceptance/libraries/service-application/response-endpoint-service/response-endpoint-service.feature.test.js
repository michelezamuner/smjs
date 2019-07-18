const assertScript = require('../../../assert-script');

test('get a static response from a widget endpoint', async () => {
    const script = 'get-a-static-response-from-a-widget-endpoint.sh';
    const args = ['books/search', `\$'format: json\n/books/search?searchText=text'`, '\'{\\"clientId\\":1234}\''];
    await assertScript(`${__dirname}/${script}`, args);
});

test.skip('get a static response from a routed endpoint', async () => {
    const script = 'get-a-static-response-from-a-routed-endpoint.sh';
    const args = ['books/search', `\$'format: json\n/books/search?searchText=text'`, '\'{\\"clientId\\":1234}\''];
    await assertScript(`${__dirname}/${script}`, args);
});