"use strict";
/**
 * PhotoItem.ts - Shared type definitions for photo items
 *
 * Common interfaces used across the application for photo management.
 * Provides type safety and consistency between different layers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SORT_OPTIONS = void 0;
exports.DEFAULT_SORT_OPTIONS = [
    {
        id: 'oldest_first',
        label: 'Oldest First',
        description: 'Start with your oldest photos',
        icon: '📅',
        sortFunction: function (a, b) { return a.creationTime - b.creationTime; }
    },
    {
        id: 'newest_first',
        label: 'Newest First',
        description: 'Start with your newest photos',
        icon: '🆕',
        sortFunction: function (a, b) { return b.creationTime - a.creationTime; }
    },
    {
        id: 'random',
        label: 'Random',
        description: 'Mix it up with random order',
        icon: '🎲',
        sortFunction: function () { return Math.random() - 0.5; }
    },
    {
        id: 'by_location',
        label: 'By Location',
        description: 'Group photos by location',
        icon: '📍',
        sortFunction: function (a, b) {
            if (!a.location && !b.location)
                return 0;
            if (!a.location)
                return 1;
            if (!b.location)
                return -1;
            return a.location.latitude - b.location.latitude;
        }
    }
];
