"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.setError = exports.privatizePhoto = exports.sharePhoto = exports.deletePhoto = exports.keepPhoto = exports.addToQueue = exports.loadNextPhoto = exports.setCurrentPhoto = exports.setLoading = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {
    currentPhoto: null,
    photoQueue: [],
    loading: false,
    error: null,
    totalProcessed: 0,
    keptPhotos: [],
    deletedPhotos: [],
    sharedPhotos: [],
    privatizedPhotos: [],
};
var photosSlice = (0, toolkit_1.createSlice)({
    name: 'photos',
    initialState: initialState,
    reducers: {
        setLoading: function (state, action) {
            state.loading = action.payload;
        },
        setCurrentPhoto: function (state, action) {
            state.currentPhoto = action.payload;
        },
        loadNextPhoto: function (state) {
            if (state.photoQueue.length > 0) {
                state.currentPhoto = state.photoQueue.shift() || null;
            }
        },
        addToQueue: function (state, action) {
            var _a;
            (_a = state.photoQueue).push.apply(_a, action.payload);
        },
        keepPhoto: function (state) {
            if (state.currentPhoto) {
                state.keptPhotos.push(state.currentPhoto.id);
                state.totalProcessed += 1;
            }
        },
        deletePhoto: function (state) {
            if (state.currentPhoto) {
                state.deletedPhotos.push(state.currentPhoto.id);
                state.totalProcessed += 1;
            }
        },
        sharePhoto: function (state) {
            if (state.currentPhoto) {
                state.sharedPhotos.push(state.currentPhoto.id);
                state.totalProcessed += 1;
            }
        },
        privatizePhoto: function (state) {
            if (state.currentPhoto) {
                state.privatizedPhotos.push(state.currentPhoto.id);
                state.totalProcessed += 1;
            }
        },
        setError: function (state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    },
});
exports.setLoading = (_a = photosSlice.actions, _a.setLoading), exports.setCurrentPhoto = _a.setCurrentPhoto, exports.loadNextPhoto = _a.loadNextPhoto, exports.addToQueue = _a.addToQueue, exports.keepPhoto = _a.keepPhoto, exports.deletePhoto = _a.deletePhoto, exports.sharePhoto = _a.sharePhoto, exports.privatizePhoto = _a.privatizePhoto, exports.setError = _a.setError;
exports.default = photosSlice.reducer;
