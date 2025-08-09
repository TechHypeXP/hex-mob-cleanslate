"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_redux_1 = require("react-redux");
var react_native_reanimated_1 = require("react-native-reanimated");
// Component imports using aliases
var SwipeCard_1 = require("@components/SwipeCard");
var selectors_1 = require("@shared/store/selectors");
var photosSlice_1 = require("@shared/store/slices/photosSlice");
var gamificationSlice_1 = require("@shared/store/slices/gamificationSlice");
var useRequestPermissions_1 = require("@hooks/useRequestPermissions");
var useHapticFeedback_1 = require("@hooks/useHapticFeedback");
function HomeScreen() {
    var dispatch = (0, react_redux_1.useDispatch)();
    var currentPhoto = (0, react_redux_1.useSelector)(selectors_1.selectCurrentPhoto);
    var isLoading = (0, react_redux_1.useSelector)(selectors_1.selectPhotosLoading);
    var hasPermissions = (0, useRequestPermissions_1.useRequestPermissions)().hasPermissions;
    var triggerHaptic = (0, useHapticFeedback_1.useHapticFeedback)().triggerHaptic;
    // Load initial photo when permissions are granted
    (0, react_1.useEffect)(function () {
        if (hasPermissions && !currentPhoto) {
            dispatch((0, photosSlice_1.loadNextPhoto)());
        }
    }, [hasPermissions, currentPhoto, dispatch]);
    var handleSwipeAction = (0, react_1.useCallback)(function (direction) {
        // Legacy UX preservation: Haptic feedback on swipe
        triggerHaptic('medium');
        // Gamification: Increment streak
        dispatch((0, gamificationSlice_1.incrementStreak)());
        // Load next photo
        dispatch((0, photosSlice_1.loadNextPhoto)());
        // TODO: Implement direction-specific actions
        // (Keep/Delete/Share/Privatize based on direction)
    }, [dispatch, triggerHaptic]);
    return (<react_native_1.SafeAreaView style={styles.container}>
      <react_native_1.View style={styles.cardContainer}>
        {isLoading ? (<react_native_1.ActivityIndicator size="large" color="#0000ff"/>) : currentPhoto ? (<react_native_reanimated_1.default.View entering={react_native_reanimated_1.FadeInDown.duration(500)}>
            <SwipeCard_1.SwipeCard photo={currentPhoto} onSwipeLeft={function () { return handleSwipeAction('left'); }} onSwipeRight={function () { return handleSwipeAction('right'); }} onSwipeUp={function () { return handleSwipeAction('up'); }} onSwipeDown={function () { return handleSwipeAction('down'); }}/>
          </react_native_reanimated_1.default.View>) : (<react_native_1.View style={styles.emptyState}>
            {/* Empty state UI */}
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
