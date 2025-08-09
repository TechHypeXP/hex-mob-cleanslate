"use strict";
/**
 * Redux Store Configuration
 *
 * Centralized state management for the CleanSlate Mobile App.
 * Uses Redux Toolkit for simplified configuration and best practices.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var toolkit_1 = require("@reduxjs/toolkit");
// Import reducers
var permissionsSlice_1 = require("./permissionsSlice");
var photosSlice_1 = require("./photosSlice");
// Create store with Redux Toolkit
var store = (0, toolkit_1.configureStore)({
    reducer: {
        permissions: permissionsSlice_1.default,
        photos: photosSlice_1.default,
    },
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: {
                // Ignore Expo MediaLibrary PermissionStatus in serialization check
                ignoredActions: ['permissions/setPhotoLibraryPermission'],
                ignoredPaths: ['permissions.photoLibrary.status'],
            },
        });
    },
});
exports.default = store;
