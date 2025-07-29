/**
 * Formats a byte value into a human-readable string with appropriate units
 * @param bytes - The number of bytes to format
 * @returns A formatted string like "1.2 KB", "3.5 MB", "2.1 GB", etc.
 */
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;

  // Calculate the appropriate unit index
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(k));

  // Ensure unit index doesn't exceed available units
  const safeUnitIndex = Math.min(unitIndex, units.length - 1);

  // Calculate the value in the appropriate unit
  const value = bytes / Math.pow(k, safeUnitIndex);

  // Format with 2 decimal places for all units except bytes
  const formattedValue = safeUnitIndex === 0
    ? value.toString()
    : value.toFixed(2);

  return `${formattedValue} ${units[safeUnitIndex]}`;
}

export const generateUUID = () => crypto.randomUUID();
