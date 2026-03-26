// Success response
const successResponse = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Error response
const errorResponse = (res, statusCode, message = 'Error') => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = { successResponse, errorResponse };
