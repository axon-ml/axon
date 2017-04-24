
/**
 * HTTP status codes. Use then when setting response.status()
 * in express route handlers.
 */
export enum HttpCodes {
    // 2xx
    OK = 200,

    // 3xx
    MOVED_PERMANENTLY = 301,

    // 4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    UNSUPPORTED_MEDIA = 415,
}
