/**
 * Thrown when trying to read data from the program, at an address that is outside of the maximum address range for the
 * program.
 */
module.exports = class InvalidAddressException extends Error {

};
