"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var query_1 = require("@reduxjs/toolkit/query");
// ✅ MODERN: DDD/Hexagonal layer organization
var gamificationSlice_1 = require("./slices/gamificationSlice");
var photosSlice_1 = require("./slices/photosSlice");
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        // ✅ LEGACY UX COMPATIBILITY: State shape matches user expectations
        gamification: gamificationSlice_1.default, // streaks, badges, achievements
        photos: photosSlice_1.default, // photo management, queue
    },
    middleware: function (getDefaultMiddleware) {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        });
    },
});
// ✅ MODERN: TypeScript excellence
(0, query_1.setupListeners)(exports.store.dispatch);
