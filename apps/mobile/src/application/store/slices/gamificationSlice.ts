import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GamificationState {
  streakCount: number;
  totalSwipes: number;
  badges: string[];
  achievements: string[];
  dailyProgress: number;
}

const initialState: GamificationState = {
  streakCount: 0,
  totalSwipes: 0,
  badges: [],
  achievements: [],
  dailyProgress: 0,
};

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    // ✅ LEGACY UX: Same gamification behavior users expect
    incrementStreak: (state) => {
      state.streakCount += 1;
      state.totalSwipes += 1;
    },
    
    resetStreak: (state) => {
      state.streakCount = 0;
    },
    
    addBadge: (state, action: PayloadAction<string>) => { // Specify payload type as string
      if (typeof action.payload === 'string' && !state.badges.includes(action.payload)) {
        state.badges.push(action.payload);
      }
    },
    
    updateDailyProgress: (state, action: PayloadAction<number>) => { // Specify payload type as number
      state.dailyProgress = action.payload;
    },
  },
});

export const { incrementStreak, resetStreak, addBadge, updateDailyProgress } = gamificationSlice.actions;
export default gamificationSlice.reducer;