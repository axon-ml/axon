

/**
 * ASCII to base64 conversion, tries to match behavior of browser JS.
 */
export function atob(s: string): string {
    return new Buffer(s).toString("base64");
}

export function btoa(s: string): string {
    return new Buffer(s, "base64").toString();
}
