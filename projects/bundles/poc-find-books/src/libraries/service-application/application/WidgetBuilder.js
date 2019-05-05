const _package = 'FindBooks.ServiceApplication.Application.';

const MessageBus = require('message-bus').MessageBus;
const Widget = require('../widgets/Widget');
const WidgetDeps = require('../widgets/WidgetDeps');
const ServiceApplicationException = require('../ServiceApplicationException');

module.exports = class WidgetBuilder {
    static toString() { return _package + WidgetBuilder.name; }

    constructor() {
        this._bus = null;
    }

    /**
     * @param {MessageBus} bus
     */
    setMessageBus(bus) {
        this._bus = bus;
    }

    /**
     * @param {Function} type
     * @param {Object} params
     * @return {Widget}
     * @throws ServiceApplicationException
     */
    build(type, params = {}) {
        if (this._bus === null) {
            throw new ServiceApplicationException('Cannot build widgets with no message bus set');
        }

        const deps = new WidgetDeps(this._bus, {}, params);
        const widget = new type(deps);
        if (!(widget instanceof Widget)) {
            throw new ServiceApplicationException(`${type} does not extend Widget`);
        }

        return widget;
    }
};
