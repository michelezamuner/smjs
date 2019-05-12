const assertScript = require('../../../assert-script');

test('get a static response from an endpoint', async () => {
    const script = 'get-a-static-response-from-an-endpoint.sh';
    const args = ['message', '/message', 'response message'];
    await assertScript(`${__dirname}/${script}`, args);
});
