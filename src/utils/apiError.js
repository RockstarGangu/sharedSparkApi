class ApiError {
  constructor(
    statusCode,
    message,
    error,
    type = "VALIDATION" | "INTERNAL" | "DATABASE" | "MISCELLANEOUS"
  ) {
    this.statusCode = statusCode;
    (this.message = message), (this.error = error);
    this.type = type;
  }
}
