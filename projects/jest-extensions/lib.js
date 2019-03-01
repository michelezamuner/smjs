expect.extend({
    to(received, callback) {
        const result = callback(received);
        if (result === false) {
            return {
                message: () => `generic assertion failed`,
                pass: false,
            }
        }
        return {
            message: () => `generic assertion succeeded`,
            pass: true,
        }
    }
});
