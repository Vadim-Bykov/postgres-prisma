export class ApiError extends Error {
  status;
  error;

  constructor(status: number, message: string, error?: any) {
    super();
    this.status = status;
    this.message = message;
    this.error = error;
  }

  static badRequest(message: string, error?: any) {
    return Response.json({ success: false, message, error }, { status: 400 });
    // return new ApiError(400, message, error);
  }

  static internal(message = "Some internal error occurred", error?: any) {
    return Response.json(
      { success: false, message, error: { ...error, message: error?.message } },
      { status: 500 }
    );
    // return new ApiError(500, message);
  }

  static forbidden(message: string) {
    return Response.json({ success: false, message }, { status: 403 });
    // return new ApiError(403, message);
  }

  static unauthorized() {
    return Response.json(
      { success: false, message: "User is unauthorized" },
      { status: 401 }
    );
    // return new ApiError(401, 'User is unauthorized');
  }
}
