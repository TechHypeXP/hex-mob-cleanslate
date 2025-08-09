"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = logError;
// ErrorLogger.ts
function logError(error, context) {
    // Example: forward to Sentry, console, or log file
    // Sentry.captureException(error); // if Sentry is set up
    console.error("[ErrorLogger]".concat(context ? ' [' + context + ']' : '', ":"), error);
}
