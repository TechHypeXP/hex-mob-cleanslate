"use strict";
/**
 * Photos Slice
 *
 * Redux slice for managing photo library state.
 * Follows Redux Toolkit patterns for clean, maintainable state management.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPhotos = exports.setFilter = exports.setSortOptions = exports.deselectAllPhotos = exports.selectAllPhotos = exports.deselectPhoto = exports.selectPhoto = exports.setError = exports.setLoading = exports.removePhoto = exports.updatePhoto = exports.addPhotos = exports.setPhotos = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// Initial state
var initialState = {
    photos: [],
    selectedPhotos: [],
    loading: false,
    error: null,
    sortBy: 'creationTime',
    sortOrder: 'desc',
    filter: {}
};
// Create the slice
var photosSlice = (0, toolkit_1.createSlice)({
    name: 'photos',
    initialState: initialState,
    reducers: {
        // Action to set photos
        setPhotos: function (state, action) {
            state.photos = action.payload;
            state.loading = false;
        },
        // Action to add photos
        addPhotos: function (state, action) {
            state.photos = __spreadArray(__spreadArray([], state.photos, true), action.payload, true);
            state.loading = false;
        },
        // Action to update a photo
        updatePhoto: function (state, action) {
            var index = state.photos.findIndex(function (photo) { return photo.id === action.payload.id; });
            if (index !== -1) {
                state.photos[index] = action.payload;
            }
        },
        // Action to remove a photo
        removePhoto: function (state, action) {
            state.photos = state.photos.filter(function (photo) { return photo.id !== action.payload; });
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
        // Action to select a photo
        selectPhoto: function (state, action) {
            if (!state.selectedPhotos.includes(action.payload)) {
                state.selectedPhotos = __spreadArray(__spreadArray([], state.selectedPhotos, true), [action.payload], false);
            }
        },
        // Action to deselect a photo
        deselectPhoto: function (state, action) {
            state.selectedPhotos = state.selectedPhotos.filter(function (id) { return id !== action.payload; });
        },
        // Action to select all photos
        selectAllPhotos: function (state) {
            state.selectedPhotos = state.photos.map(function (photo) { return photo.id; });
        },
        // Action to deselect all photos
        deselectAllPhotos: function (state) {
            state.selectedPhotos = [];
        },
        // Action to set sort options
        setSortOptions: function (state, action) {
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;
        },
        // Action to set filter options
        setFilter: function (state, action) {
            state.filter = action.payload;
        },
        // Action to reset photos state
        resetPhotos: function (state) {
            state.photos = [];
            state.selectedPhotos = [];
            state.loading = false;
            state.error = null;
        },
    },
});
// Export actions
exports.setPhotos = (_a = photosSlice.actions, _a.setPhotos), exports.addPhotos = _a.addPhotos, exports.updatePhoto = _a.updatePhoto, exports.removePhoto = _a.removePhoto, exports.setLoading = _a.setLoading, exports.setError = _a.setError, exports.selectPhoto = _a.selectPhoto, exports.deselectPhoto = _a.deselectPhoto, exports.selectAllPhotos = _a.selectAllPhotos, exports.deselectAllPhotos = _a.deselectAllPhotos, exports.setSortOptions = _a.setSortOptions, exports.setFilter = _a.setFilter, exports.resetPhotos = _a.resetPhotos;
// Export reducer
exports.default = photosSlice.reducer;
