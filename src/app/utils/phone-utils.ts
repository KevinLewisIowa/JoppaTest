// src/app/utils/phone-utils.ts

/**
 * Formats a string as a US phone number (###-###-####) as the user types.
 * @param value The input string to format
 * @returns The formatted phone number string
 */
export function formatPhoneNumberValue(value: string): string {
  if (!value) return '';
  let cleaned = value.replace(/\D/g, '');
  if (cleaned.length > 6) {
    return cleaned.replace(/^(\d{3})(\d{3})(\d{0,4}).*/, '$1-$2-$3').replace(/-$/, '');
  } else if (cleaned.length > 3) {
    return cleaned.replace(/^(\d{3})(\d{0,3})/, '$1-$2');
  } else {
    return cleaned;
  }
}
