// const asyncHandler = (requestHandler) => {
//   return (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

// export { asyncHandler };

const asyncHandler = (fn) => async (req, res, next) => {
    try {
      await fn(req,res,next)    // await for fn
    res.status(err.code || 500).json({
      success: false,   // json response can also be send for frontend
      message: err.message,
      // if user is sending err code -> err.code, if not 500 or 400
    });
  }
};

export { asyncHandler };
