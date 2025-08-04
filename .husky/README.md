# Husky Git Hooks

This directory contains Git hooks managed by Husky for the CleanSlate Mobile App project.

## Pre-push Hook

The pre-push hook automatically generates documentation before pushing to ensure documentation is always up-to-date.

### Features

1. **Automatic Documentation Generation**: Runs `bun run docs:generate` before every push
2. **Automatic Staging**: Stages any updated documentation files in the `docs/` directory
3. **Push Protection**: Aborts the push if documentation generation fails
4. **Zero Manual Drift**: Ensures documentation is always in sync with code changes

### How It Works

1. Before each push, the hook runs the unified documentation generation script
2. If documentation files are modified during generation, they are automatically staged
3. If documentation generation fails, the push is aborted
4. If successful, the push proceeds with updated documentation

### Installation

The hooks are automatically installed when you run:
```bash
bun install
```

This works because the `prepare` script in `package.json` runs `husky` to set up the hooks.

### Manual Installation

If you need to manually install or reinstall the hooks:
```bash
bunx husky install
```

### Testing the Hook

To test the pre-push hook without actually pushing:
```bash
.husky/pre-push
```

### Disabling the Hook

To temporarily disable the pre-push hook:
```bash
chmod -x .husky/pre-push
```

To re-enable:
```bash
chmod +x .husky/pre-push
```

### Customization

To modify the pre-push behavior, edit the `.husky/pre-push` file. The hook will:
- Run `bun run docs:generate` to generate all documentation
- Automatically stage any changes in the `docs/` directory
- Fail the push if documentation generation fails