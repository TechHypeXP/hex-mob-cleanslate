// ErrorLogger.ts
export function logError(error: unknown, context?: string) {
  // Example: forward to Sentry, console, or log file
  // Sentry.captureException(error); // if Sentry is set up
  console.error(`[ErrorLogger]${context ? ' [' + context + ']' : ''}:`, error);
}
