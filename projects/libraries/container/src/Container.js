const _package = 'Container.';

const ContainerException = require('./ContainerException');

module.exports = class Container {
    static toString() { return _package + Container.name; }

    constructor() {
        this._bound = new Map();
        this._boundContext = new Map();
    }

    /**
     * @param {Object} ref
     * @param {Object} bound
     * @param {Object|null} context
     */
    bind(ref, bound, context = null) {
        if (context === null) {
            this._bound.set(ref, bound);
        }
        if (context !== null) {
            this._boundContext.set(context, {[ref]: bound});
        }
    }

    /**
     * @param {Object} ref
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     */
    make(ref, context = null) {
        if (ref === Container) {
            return this;
        }

        if (this._boundContext.has(ref)) {
            if (context === null) {
                context = {};
            }
            Object.assign(context, this._boundContext.get(ref));
        }

        const bound = this._getBound(ref, context);
        if (bound !== null) {
            return this._makeBound(ref, context, bound);
        }

        if (ref.__DEPS__ !== undefined) {
            return this._makeDependent(ref, context);
        }

        return this._makeBare(ref, context);
    }

    /**
     * @param {Object} ref 
     * @param {Object|null} context 
     * @return {Object}
     * @private
     */
    _getBound(ref, context) {
        const contextBound = context !== null && context[ref] || null;
        if (contextBound !== null) {
            return contextBound;
        }

        return this._bound.has(ref) ? this._bound.get(ref) : null;
    }

    /**
     * @param {Object} ref
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeBound(ref, context, bound) {
        try {
            // instance
            if (bound.constructor === undefined || bound.constructor.name !== 'Function') {
                return bound;
            }

            // type
            if (bound.prototype !== undefined) {
                return this.make(bound, context);
            }

            // callback
            return bound(this, context);
        } catch (e) {
            throw new ContainerException(`Error making bound reference "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @param {Object|null} context
     * @return {Object}
     * @throws {ContainerException}
     * @private
     */
    _makeDependent(ref, context) {
        try {
            return new ref(...ref.__DEPS__.map(dep => this.make(dep, context)));
        } catch (e) {
            throw new ContainerException(`Error making reference with dependencies "${ref}": ${e.message || e}`);
        }
    }

    /**
     * @param {Function} ref
     * @param {Object|null} context
     * @return {Object}
     * @private
     */
    _makeBare(ref, context) {
        try {
            return new ref(context);
        } catch (e) {
            throw new ContainerException(`Error making unbound reference "${ref}": ${e.message || e}`);
        }
    }
};
