export interface Error {
  message?: string;
  required?: string[];
  optional?: string[];
}

export interface ErrorResponse {
  error: Error;
}
