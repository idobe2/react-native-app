export function passwordValidator(password: string): string {
    if (!password) return "Password can't be empty."
    if (password.length < 6) return 'Password must be at least 6 characters long.'
    return ''
  }

  export function passwordMatchValidator(password: string, confirmPassword: string): string {
    if (password !== confirmPassword) return 'Passwords do not match.'
    return ''
  }
  