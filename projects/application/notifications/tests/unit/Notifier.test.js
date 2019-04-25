const Notifier = require('../../src/Notifier');

test('provides fqcn', () => {
    expect(Notifier.toString()).toBe('SlothMachine.Notifications.Notifier');
});
