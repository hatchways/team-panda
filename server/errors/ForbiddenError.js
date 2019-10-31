const CustomError = require("./CustomError");

class ForbiddenError extends CustomError {
    constructor(message = "Forbidden", ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ForbiddenError);
        }
        this.status = 403;
        this.message = message;
    }
}

module.exports = ForbiddenError;
