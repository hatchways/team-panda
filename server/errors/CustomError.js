// Base error class for custom errors

class CustomError extends Error {
    constructor(message = "CustomError", ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
        this.status = 400;
        this.message = message;
    }
}

module.exports = CustomError;
