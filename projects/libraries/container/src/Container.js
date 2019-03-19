const ContainerException = require('./ContainerException');

module.exports = class Container_Container {
    constructor() {
        this._bound = {};
    }

    /**
     * @param ref
     * @param object
     */
    bind(ref, object) {
        this._bound[ref] = object;
    }

    /**
     * @param ref
     * @return {*}
     * @throws {ContainerException}
     */
    make(ref) {
        if (ref === Container_Container) {
            return this;
        }

        if (ref in this._bound) {
            return this._makeBound(ref);
        }

        if (ref.__DEPS__ !== undefined) {
            return this._makeUnbound(ref);
        }

        try {
            return new ref();
        } catch (e) {
            throw new ContainerException(`Unbound reference "${ref.name || ref}"`);
        }
    }

    /**
     * @param ref
     * @return {*}
     * @private
     */
    _makeBound(ref) {
        // instance
        if (this._bound[ref].constructor === undefined || this._bound[ref].constructor.name !== 'Function') {
            return this._bound[ref];
        }

        // type
        if (this._bound[ref].prototype !== undefined) {
            return this.make(this._bound[ref]);
        }

        // callback
        return this._bound[ref]();
    }

    /**
     * @param ref
     * @return {*}
     * @private
     */
    _makeUnbound(ref) {
        return new ref(...ref.__DEPS__.map(dep => this.make(dep)));
    }
};
