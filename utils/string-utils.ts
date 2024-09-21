/**
 * Replaces underscores in a string with spaces for better readability.
 * @param inputString - The string to convert.
 * @returns The converted string with spaces instead of underscores.
 */
export function replaceUnderscoresWithSpaces(inputString: string): string {
    return inputString.replace(/_/g, ' '); // Replace underscores with spaces
}