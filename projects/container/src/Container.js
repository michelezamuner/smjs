module.exports = class Container {
    constructor() {
        this._bound = {};
    }

    bind(type, object) {
        this._bound[type] = object;
    }

    make(type) {
        if (type in this._bound) {
            return this._makeBound(type);
        }

        if (type.__DEPS__ !== undefined) {
            return this._makeUnbound(type);
        }

        return new type();
    }

    _makeBound(type) {
        if (this._bound[type].constructor === undefined || this._bound[type].constructor.name !== 'Function') {
            return this._bound[type];
        }

        try {
            return this.make(this._bound[type]);
        } catch (e) {
            if (e.message.indexOf('is not a constructor') >= 0) {
                return this._bound[type]();
            }

            throw e;
        }
    }

    _makeUnbound(type) {
        return new type(...type.__DEPS__.map(dep => this.make(dep)));
    }
};
