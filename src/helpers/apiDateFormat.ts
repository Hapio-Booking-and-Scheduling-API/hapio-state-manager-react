/**
 * Formats a Date object to the API-compatible format: Y-m-d\TH:i:sP
 * Uses the local timezone of the date as provided
 */
export const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Get timezone offset in minutes and convert to ±HH:MM format
    const timezoneOffset = date.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset <= 0 ? '+' : '-';
    const offsetString = `${offsetSign}${String(offsetHours).padStart(
        2,
        '0'
    )}:${String(offsetMinutes).padStart(2, '0')}`;

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
};

/**
 * Helper function to build URL query parameters safely.
 * Automatically URL-encodes all parameter values.
 *
 * @param baseUrl - Base URL without query parameters
 * @param params - Object of parameter key-value pairs
 * @returns Complete URL with encoded query parameters
 */
export const buildApiUrl = (
    baseUrl: string,
    params: Record<string, string | number>
): string => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
    });

    return `${baseUrl}?${searchParams.toString()}`;
};
