/* eslint-env node */
/**
 * BULLETPROOF EXPO SDK V53 METRO CONFIGURATION
 * 
 * This configuration enables universal aliases and isolates Vrite content management
 * from the React Native mobile app bundle generation.
 * 
 * Key Features:
 * - @shared/* aliases for clean imports across packages
 * - Vrite isolation prevents DOM/RN lib conflicts
 * - Optimized for Bun + Expo SDK v53 compatibility
 * 
 * Last Updated: 2025-08-07
 * Related: apps/mobile/tsconfig.json, packages/shared/tsconfig.json
 */

// @ts-expect-error
const { getDefaultConfig } = require('expo/metro-config');
// @ts-expect-error
const path = require('path');

// @ts-expect-error
const config = getDefaultConfig(__dirname);

// Universal alias resolution - eliminates ../../../.. relative imports
config.resolver.alias = {
  '@shared/types': path.resolve(__dirname, './packages/shared/types'),
  '@shared': path.resolve(__dirname, './packages/shared'),
  '@content': path.resolve(__dirname, './packages/content'),
};

// Exclude Vrite from bundling - prevents 265+ TypeScript errors from interfering
// with mobile app compilation (tools/vrite uses DOM libs, mobile uses RN libs)
config.resolver.blacklistRE = /tools\/vrite\/.*/;

// @ts-expect-error
module.exports = config;