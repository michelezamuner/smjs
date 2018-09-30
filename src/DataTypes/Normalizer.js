const DataType = require('./DataType');
const Byte = require('./Byte');

module.exports = class Normalizer {
    /**
     * @param {DataType} data
     * @returns {Byte[]}
     */
    normalize(data) {
        const values = [];
        let value = data.toInt();
        while (true) {
            if (Math.floor(value / 256) === 0) {
                values.push(value);
                break;
            }
            let remainder = value % 256;
            values.push(remainder);
            value = (value - remainder) / 256;
        }

        const bytes = [];
        for (let i = 0; i < data.constructor.SIZE; i++) {
            bytes[i] = values[i] ? new Byte(values[i]) : new Byte(0x00);
        }
        return bytes.reverse();
    }
};
