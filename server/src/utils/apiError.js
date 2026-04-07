export class ApiError extends Error {
  constructor(statusCode = 500, message = "Something went wrong", details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}