export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validateAmount(amount: number): boolean {
  return !isNaN(amount) && amount > 0 && isFinite(amount);
}

export function validatePersonName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 100;
}

export function validateCategoryName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 50;
}

export function validateNote(note: string): boolean {
  return note.length <= 500;
}
