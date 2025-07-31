/**
 * Redux Store Configuration
 * 
 * Centralized state management for the CleanSlate Mobile App.
 * Follows Redux best practices with proper typing and middleware.
 */

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import permissionsReducer from './permissionsSlice';

// Combine all reducers
const rootReducer = combineReducers({
  permissions: permissionsReducer,
});

// Define root state type
export type RootState = ReturnType<typeof rootReducer>;

// Create store with middleware
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;