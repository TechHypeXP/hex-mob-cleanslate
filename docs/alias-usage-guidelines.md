# Alias Usage Guidelines

To maintain a clean and understandable import structure, we've configured path aliases in our TypeScript configuration. This document outlines the available aliases and usage guidelines.

## Available Aliases

- `@shared/*`: Points to `packages/shared/*`
  - Use for shared utilities, constants, and types
- `@components/*`: Points to `components/*` (relative to baseUrl)
  - Use for reusable UI components
- `@hooks/*`: Points to `hooks/*`
  - Use for custom React hooks
- `@utils/*`: Points to `utils/*`
  - Use for utility functions and helpers

## Usage Examples

✅ **Correct (using aliases):**
```typescript
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/date';
import { API_URL } from '@shared/constants';
```

❌ **Incorrect (using relative paths):**
```typescript
// Avoid deep relative paths
import { Button } from '../../../../components/Button';
import { useAuth } from '../../../hooks/useAuth';
```

## Best Practices

1. Always use aliases instead of relative paths for imports outside the current directory
2. Keep relative paths only for imports within the same feature directory
3. Update imports when moving files to maintain alias consistency
4. Use the most specific alias possible (e.g., prefer `@components` over `@shared` for UI components)

## Enforcement

ESLint rules have been configured to:
- Warn when relative paths go beyond 2 levels (`../../`)
- Error when relative paths go beyond 3 levels (`../../../`)

Run `bun lint` to verify your imports comply with these guidelines.

## ✅ EXAMPLES - DO THIS

### Mobile App Components
```typescript
// ✅ Correct
import PhotoItem from '@shared/types/PhotoItem';
import { usePhotoSwipe } from '@hooks/usePhotoSwipe';
import Button from '@components/Button/Button';
```

### Shared Package Exports
```typescript
// ✅ Correct - internal to shared package
import { BaseEntity } from './BaseEntity';  
import { ApiClient } from '../services/ApiClient';

// ✅ Correct - cross-package imports
import { MobileComponent } from '@mobile/components/SomeComponent';
```

## ❌ NEVER DO THIS

```
// ❌ Deep relative imports
import PhotoItem from '../../../../../../packages/shared/types/PhotoItem';
import { useHook } from '../../../hooks/useHook';

// ❌ Absolute paths  
import Button from '/src/components/Button/Button';
```