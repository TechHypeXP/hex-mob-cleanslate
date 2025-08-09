/* eslint-env node */
#!/usr/bin/env node
if (process.env.npm_execpath && process.env.npm_execpath.includes('npm')) {
  console.error('❌ NPM IS BANNED FROM THIS BULLETPROOF ENVIRONMENT');
  console.error('📦 Use: bun install or pnpm install');
  process.exit(1);
}
console.log('✅ Package manager check passed');
