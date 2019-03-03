const SimpleMessageBus = require('../../../src/adapters/message_bus/SimpleMessageBus');

/**
 * @type {null|SimpleMessageBus}
 */
let bus = null;

class MessageType {}
class OtherType {}

beforeEach(() => {
    bus = new SimpleMessageBus();
});

test('calls all registered handlers for types of sent messages', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    const handler3 = jest.fn();
    const message1 = new MessageType();
    const message2 = new OtherType();

    bus.register([MessageType], handler1);
    bus.register([MessageType], handler2);
    bus.register([OtherType], handler3);
    bus.send(message1);
    bus.send(message2);

    expect(handler1.mock.calls[0][0]).toBe(message1);
    expect(handler2.mock.calls[0][0]).toBe(message1);
    expect(handler3.mock.calls[0][0]).toBe(message2);
});

test('registers multiple types for same handler', () => {
    const handler = jest.fn();
    const message1 = new MessageType();
    const message2 = new OtherType();

    bus.register([MessageType, OtherType], handler);
    bus.send(message1);
    bus.send(message2);

    expect(handler.mock.calls[0][0]).toBe(message1);
    expect(handler.mock.calls[1][0]).toBe(message2);
});

test('does not call registered handlers for types different than sent message', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    bus.register([MessageType], handler1);
    bus.register([OtherType], handler2);
    bus.send(new MessageType());

    expect(handler2).not.toBeCalled();
});

test('does nothing if no handler is registered for type of sent message', () => {
    const handler = jest.fn();

    bus.register([MessageType], handler);
    bus.send(new OtherType());

    expect(handler).not.toBeCalled();
});
