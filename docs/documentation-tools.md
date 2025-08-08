# Documentation Tools Setup Guide

This project uses several tools to generate and maintain documentation:

## TypeDoc
TypeDoc generates static API documentation from TypeScript source code.

**Installation:**
```bash
bun add -d typedoc
```

**Configuration:**
- `typedoc.json` - Configuration file in project root
- Entry points: `apps/mobile/src`
- Output directory: `docs/api`

**Usage:**
```bash
npx typedoc
```

## Code Narrator
Code Narrator generates AI-assisted documentation using LLMs.

**Installation:**
```bash
bun add -d code-narrator
```

**Configuration:**
- `code-narrator.yaml` - Configuration file in project root
- Source directory: `apps/mobile/src`
- Output directory: `docs/narration`

**Usage:**
```bash
npx code-narrator document
```

**Note:** Requires OpenAI API key in `.env` file:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Swimm (Not Available)
Swimm is intended for interactive code annotation and walkthroughs, but it appears to be unavailable in package registries. You may need to:

1. Check https://swimm.io/ for installation instructions
2. Install via their official distribution method
3. Run setup: `npx swimm setup`
4. Preview docs: `npx swimm preview`

## Combined Workflow
To update all documentation at once:
```bash
npx typedoc && npx code-narrator document
```

### Automated Workflow
A unified script has been added to package.json for easier documentation generation:
```bash
bun run docs:generate
```

## Documentation Quality Assurance
This project now includes automated markdown linting:
- remark-lint is configured in lint-staged
- Markdown files are automatically linted on commit
- Consistent formatting and quality checks for all documentation

## Automated Documentation Updates
This project includes a Git pre-push hook that automatically generates and stages documentation before pushing:

- Runs `bun run docs:generate` before every push
- Automatically stages any updated documentation files in the `docs/` directory
- Aborts the push if documentation generation fails
- Ensures zero manual documentation drift

The hook is located at `.husky/pre-push` and is automatically installed when you run `bun install`.

## CI/CD Integration Recommendations
Consider integrating documentation generation into your CI/CD pipeline:
- Add `bun run docs:generate` to your build process
- Schedule regular documentation updates (nightly builds)
- Automatically publish generated docs to GitHub Pages or internal documentation sites