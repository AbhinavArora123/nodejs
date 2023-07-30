const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Wrong mongodb:
    if (err.name === "CastError") {
        const message = `Resourse not found. Invalid:${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //mongoose duplicate error/already existing email:
    if (err.code === 11000) {
        const message = `${Object.keys(err.keyValue)} already Exists. Try Signing in`
        err = new ErrorHandler(message, 400);
    }

    //jwt error
    if (err.name === 'JsonWebTokenError') {
        const message = `JsonWebToken id invalid.`;
        err = new ErrorHandler(message, 400);
    }

    if (err.name === 'TokenExpiredError') {
        const message = `JsonWebToken has expired.`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        messsage: err.message,
    })
}