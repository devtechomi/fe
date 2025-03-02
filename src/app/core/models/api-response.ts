export interface ApiResponse {
    statusCode: number,
    isSuccess: boolean,
    message?: string,
    data?: any,
    error?: any,
    metadata?: any
}