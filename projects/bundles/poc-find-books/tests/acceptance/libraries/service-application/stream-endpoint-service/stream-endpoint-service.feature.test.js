const assertScript = require('../../../assert-script');

test('get messages stream to different connections from same endpoint', async () => {
    const script = 'get-messages-stream-to-different-connections-from-same-endpoint.sh';
    const args = ['stream', '/stream?id=1234', '/stream?id=4321', 'data11', 'data12', 'data21', 'data22'];
    await assertScript(`${__dirname}/${script}`, args);
});
