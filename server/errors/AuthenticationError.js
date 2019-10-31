const CustomError = require("./CustomError");

class AuthenticationError extends CustomError {
    constructor(message = "Error logging in", ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthenticationError);
        }

        this.status = 401;
        this.message = message;
    }
}

module.exports = AuthenticationError;
