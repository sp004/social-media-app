export const ErrorHandler = (status, message) => {
    const error = new Error()
    error.status = status
    error.message = message
    return error
}

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };