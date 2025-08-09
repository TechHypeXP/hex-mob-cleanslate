# Error Logging

**Architectural Rule:** All error handling within the application must use the centralized `ErrorLogger` utility. Direct use of `console.error`, `console.warn`, or other logging mechanisms for errors is strictly prohibited.

This ensures that all errors are captured, formatted, and processed consistently, which is critical for auditing, monitoring, and compliance.

## Usage

To log an error, import and use the `logError` function:

```typescript
import { logError } from '@/crosscutting/logging/ErrorLogger';

try {
  // some fallible operation
} catch (error) {
  logError(error, 'MyComponent');
}
```
