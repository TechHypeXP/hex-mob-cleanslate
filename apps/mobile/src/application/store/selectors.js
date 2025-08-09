"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectPrivatizedPhotos = exports.selectSharedPhotos = exports.selectDeletedPhotos = exports.selectKeptPhotos = exports.selectBadgeCount = exports.selectBadges = exports.selectTotalSwipes = exports.selectStreakCount = exports.selectTotalProcessed = exports.selectPhotosError = exports.selectPhotosLoading = exports.selectCurrentPhoto = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
// Photos selectors
var selectCurrentPhoto = function (state) { return state.photos.currentPhoto; };
exports.selectCurrentPhoto = selectCurrentPhoto;
var selectPhotosLoading = function (state) { return state.photos.loading; };
exports.selectPhotosLoading = selectPhotosLoading;
var selectPhotosError = function (state) { return state.photos.error; };
exports.selectPhotosError = selectPhotosError;
var selectTotalProcessed = function (state) { return state.photos.totalProcessed; };
exports.selectTotalProcessed = selectTotalProcessed;
// Gamification selectors
var selectStreakCount = function (state) { return state.gamification.streakCount; };
exports.selectStreakCount = selectStreakCount;
var selectTotalSwipes = function (state) { return state.gamification.totalSwipes; };
exports.selectTotalSwipes = selectTotalSwipes;
var selectBadges = function (state) { return state.gamification.badges; };
exports.selectBadges = selectBadges;
exports.selectBadgeCount = (0, toolkit_1.createSelector)([exports.selectBadges], function (badges) { return badges.length; });
// Photo action selectors
var selectKeptPhotos = function (state) { return state.photos.keptPhotos; };
exports.selectKeptPhotos = selectKeptPhotos;
var selectDeletedPhotos = function (state) { return state.photos.deletedPhotos; };
exports.selectDeletedPhotos = selectDeletedPhotos;
var selectSharedPhotos = function (state) { return state.photos.sharedPhotos; };
exports.selectSharedPhotos = selectSharedPhotos;
var selectPrivatizedPhotos = function (state) { return state.photos.privatizedPhotos; };
exports.selectPrivatizedPhotos = selectPrivatizedPhotos;
