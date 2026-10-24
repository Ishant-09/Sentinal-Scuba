import { ulid } from 'ulid';

export function generateUlid(): string {
  try {
    return ulid();
  } catch {
    // Monotonic timestamp fallback if ulid runtime issue
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
  }
}
