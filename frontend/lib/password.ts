export function testPasswordFormat (password: string): boolean {
  // All 4 classes and at least 8 characters
  const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return passwordRegex.test(password);
}