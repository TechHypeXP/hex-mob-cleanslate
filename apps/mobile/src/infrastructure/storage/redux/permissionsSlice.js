"use strict";
/**
 * Permissions Slice
 *
 * Redux slice for managing photo library permissions state.
 * Follows Redux Toolkit patterns for clean, maintainable state management.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPermissions = exports.setError = exports.setLoading = exports.setPhotoLibraryPermission = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var expo_media_library_1 = require("expo-media-library");
// Initial state
var initialState = {
    photoLibrary: {
        status: expo_media_library_1.PermissionStatus.UNDETERMINED,
        canAskAgain: true,
        granted: false,
        lastChecked: null,
    },
    loading: false,
    error: null,
};
// Create the slice
var permissionsSlice = (0, toolkit_1.createSlice)({
    name: 'permissions',
    initialState: initialState,
    reducers: {
        // Action to set photo library permission status
        setPhotoLibraryPermission: function (state, action) {
            state.photoLibrary = __assign(__assign({}, action.payload), { lastChecked: Date.now() });
            state.loading = false;
        },
        // Action to set loading state
        setLoading: function (state, action) {
            state.loading = action.payload;
        },
        // Action to set error state
        setError: function (state, action) {
            state.error = action.payload;
            state.loading = false;
        },
        // Action to reset permissions state
        resetPermissions: function (state) {
            state.photoLibrary = initialState.photoLibrary;
            state.loading = false;
            state.error = null;
        },
    },
});
// Export actions
exports.setPhotoLibraryPermission = (_a = permissionsSlice.actions, _a.setPhotoLibraryPermission), exports.setLoading = _a.setLoading, exports.setError = _a.setError, exports.resetPermissions = _a.resetPermissions;
// Export reducer
exports.default = permissionsSlice.reducer;
