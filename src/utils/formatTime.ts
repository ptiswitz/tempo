/**
 * Formats seconds into HH:MM:SS string.
 */
export function formatSecondsToHHMMSS(totalSeconds: number): string {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return '00:00:00';
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    // Decide whether to show hours based on if they exist
    // For consistency in a list, always showing HH:MM:SS is often better.
    // return hours > 0
    //   ? `${paddedHours}:${paddedMinutes}:${paddedSeconds}`
    //   : `${paddedMinutes}:${paddedSeconds}`;
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}