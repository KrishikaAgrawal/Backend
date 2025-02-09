class ApiError extends Error {
  // ApiError (our class) inherits Error class of nodejs
  // making constructor and override it later
  constructor(
    statusCode, // whoever use the constructor, pass status code
    message = "Something went wrong", // Default error message if none is provided (not ideal in production, as it lacks detail).
    errors = [], // Can hold an array of multiple validation errors (useful for form validation, API responses).
    stack = "" // Stack trace of the error (optional, but useful for debugging).
  ) {
    // Overriding the Parent Class Constructor
    super(message); // message of constructor must be override
    this.StatusCode = statusCode; // Stores the HTTP status code
    this.data = null; // Defaulted to null, can be extended later if needed
    this.message = message; // Stores the error message.
    this.success = false; // Always false (helps in standardizing API responses)
    this.errors = errors; // Stores any additional errors (e.g., validation errors)

    // not compulsory case -> can easily avoid
    if (stack) {
      // to get the stack trace if error
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export {ApiError}