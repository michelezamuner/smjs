const _package = 'Router.';

/**
 * Thrown when an error happen while routing requests.
 */
module.exports = class RouterException extends Error {
    static toString() { return _package + RouterException.name; }
};
