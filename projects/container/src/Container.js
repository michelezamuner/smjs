module.exports = class Container {
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
     */
    make(ref) {
        if (ref in this._bound) {
            return this._makeBound(ref);
        }

        if (ref.__DEPS__ !== undefined) {
            return this._makeUnbound(ref);
        }

        return new ref();
    }

    /**
     * @param ref
     * @return {*}
     * @private
     */
    _makeBound(ref) {
        // Instance
        if (this._bound[ref].constructor === undefined || this._bound[ref].constructor.name !== 'Function') {
            return this._bound[ref];
        }

        // Type
        if (this._bound[ref].prototype !== undefined) {
            return this.make(this._bound[ref]);
        }

        // Callback
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
