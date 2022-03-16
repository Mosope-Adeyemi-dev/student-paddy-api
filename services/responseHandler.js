exports.responseHandler = (
  res,
  message,
  statusCode,
  error = true,
  data = {}
) => {
  res.status(statusCode).json({
    error,
    message,
    data,
  });
};
