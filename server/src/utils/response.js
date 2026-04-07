export function successResponse(res, message, data = {}, status = 200) {
  return res.status(status).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(res, message = "Something went wrong", status = 500, errors = null) {
  return res.status(status).json({
    success: false,
    message,
    errors
  });
}