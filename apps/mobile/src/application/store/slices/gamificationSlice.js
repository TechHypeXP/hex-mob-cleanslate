"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDailyProgress = exports.addBadge = exports.resetStreak = exports.incrementStreak = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {
    streakCount: 0,
    totalSwipes: 0,
    badges: [],
    achievements: [],
    dailyProgress: 0,
};
var gamificationSlice = (0, toolkit_1.createSlice)({
    name: 'gamification',
    initialState: initialState,
    reducers: {
        // ✅ LEGACY UX: Same gamification behavior users expect
        incrementStreak: function (state) {
            state.streakCount += 1;
            state.totalSwipes += 1;
        },
        resetStreak: function (state) {
            state.streakCount = 0;
        },
        addBadge: function (state, action) {
            if (typeof action.payload === 'string' && !state.badges.includes(action.payload)) {
                state.badges.push(action.payload);
            }
        },
        updateDailyProgress: function (state, action) {
            state.dailyProgress = action.payload;
        },
    },
});
exports.incrementStreak = (_a = gamificationSlice.actions, _a.incrementStreak), exports.resetStreak = _a.resetStreak, exports.addBadge = _a.addBadge, exports.updateDailyProgress = _a.updateDailyProgress;
exports.default = gamificationSlice.reducer;
