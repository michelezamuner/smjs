const _package = 'Router.';

/**
 * Thrown when an error happens while trying to route an input.
 */
module.exports = class RouterException extends Error {
    static toString() { return _package + RouterException.name; }
};
