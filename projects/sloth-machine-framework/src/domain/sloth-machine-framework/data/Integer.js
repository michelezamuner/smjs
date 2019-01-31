module.exports = class Integer {
    constructor(value = null) {
        this._value = this._parseValue(value);
    }

    eq(integer) {
        return this._value === integer._value;
    }

    format() {
        return '' + this._value;
    }

    add(number) {
        return new Integer(this._value + number._value);
    }

    _parseValue(value) {
        if (!value) {
            return 0;
        }
        if (value instanceof Integer) {
            return value._value;
        }
        return parseInt(value);
    }
};
