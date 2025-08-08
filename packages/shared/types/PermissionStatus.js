"use strict";
/**
 * PermissionStatus.ts - Shared type definitions for permission status
 *
 * Common interfaces used across the application for permission management.
 * Provides type safety and consistency between different layers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionStatus = void 0;
var PermissionStatus;
(function (PermissionStatus) {
    PermissionStatus["UNDETERMINED"] = "undetermined";
    PermissionStatus["DENIED"] = "denied";
    PermissionStatus["AUTHORIZED"] = "authorized";
    PermissionStatus["LIMITED"] = "limited";
    PermissionStatus["ERROR"] = "error";
})(PermissionStatus || (exports.PermissionStatus = PermissionStatus = {}));
