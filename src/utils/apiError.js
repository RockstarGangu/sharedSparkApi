export class ApiError {
  constructor(statusCode, type, message, errors = [], suggestion, path) {
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.type = type;
    this.suggestion = suggestion;
    this.path = path;
  }
}
