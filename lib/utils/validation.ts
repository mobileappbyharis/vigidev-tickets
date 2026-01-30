/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
 */
export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Get password validation errors
 */
export function getPasswordErrors(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Au moins une minuscule');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Au moins une majuscule');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Au moins un chiffre');
  }

  return errors;
}

/**
 * Validate ticket title
 */
export function isValidTicketTitle(title: string): boolean {
  return title.trim().length >= 10;
}

/**
 * Validate project name
 */
export function isValidProjectName(name: string): boolean {
  return name.trim().length >= 3;
}
