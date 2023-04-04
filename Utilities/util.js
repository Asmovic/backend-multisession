const bcrypt = require('bcrypt');

// Define Error Codes
let statusCode = {
    ZERO: 0,
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    OK: 200,
    INVALID_PARAMETER: 400,
    SERVER_LOGIC_ERROR: 400,
    FOUR_ZERO_FOUR: 404,
    FOUR_ZERO_THREE: 403,
    FOUR_ZERO_ONE: 401,
    FOUR_ZERO_TWO: 402,
    FIVE_ZERO_ZERO: 405,
    FOUR_ZERO_SIX: 406,
    FOUR_ONE_FOUR: 414,
    FOUR_TWO_FOUR: 424,
    INTERNAL_SERVER_ERROR: 500,
};

// Define Error Messages
let statusMessage = {

    LOGIN_EXPIRED: "Please login again",
    DATA_FETCHED: "Data fetched successfully.",
    DATA_UPDATED: "Data updated successfully.",
    INCORRECT_PASSWORD:
        "Wrong password. Try again or click 'Forgot Password' to reset it",
    ACCOUNT_LOCKED:
        "Your account is locked. Please contact admin for further details.",
    EMAIL_NOT_EXISTS: "Oops! This email doesn't exist. Please sign up",
    LOGGED_IN: "Welcome back to Platute!",
};

const statusResponseObjects = {
    errorReturnMessage500: {
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        statusMessage: statusMessage.SERVER_BUSY,
    },

    errorInvalidParameter: {
        statusCode: 400,
        statusMessage: "Invalid Parameter",
    },

    serverBusy: {
        statusCode: statusCode.FOUR_ZERO_ONE,
        statusMessage: statusMessage.SERVER_BUSY,
    },
}

const decryptPasswordAsync = (myPlaintextPassword, hash, callback) => {
    bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, { result: result });
        }
    });
};

module.exports = {
    statusCode: statusCode,
    statusMessage: statusMessage,
    statusResponseObjects,
    decryptPasswordAsync,
}