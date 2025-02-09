class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 200 for success, 400 for client error)
   * @param {any} data - The response data (can be an object, array, string, etc.)
   * @param {string} message - Custom success message (default: "Success")
   */
  constructor(statusCode, data, message = "Success") {
    // Assign the provided status code to the instance
    this.statusCode = statusCode;

    // Assign the response message (default is "Success" if not provided)
    this.message = message;

    // Determine if the response is a success based on HTTP status code
    // Status codes below 400 are considered successful (e.g., 200, 201)
    this.success = statusCode < 400;

    // Store the actual response data
    this.data = data;
  }
}

export { ApiResponse };
