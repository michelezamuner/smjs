const assertScript = require('../../../assert-script');

test('get messages stream to different connections from same endpoint', async () => {
    const script = 'get-messages-stream-to-different-connections-from-same-endpoint.sh';
    const args = [
        'books/results',
        `\$'format: txt\n/books/results?id=1234'`,
        `\$'format: txt\n/books/results?id=4321'`,
        'data11',
        'data12',
        'data21',
        'data22'
    ];
    await assertScript(`${__dirname}/${script}`, args);
});
