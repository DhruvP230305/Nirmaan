export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Generates a success API response structure
 * @param message Success message
 * @param data Response payload
 */
export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Generates an error API response structure
 * @param message User-friendly error message
 * @param errorCode Specific error code for frontend reference
 */
export const errorResponse = (message: string, errorCode: string): ApiResponse => {
  return {
    success: false,
    message,
    error: errorCode,
  };
};
