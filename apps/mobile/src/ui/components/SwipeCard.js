"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipeCard = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_reanimated_1 = require("react-native-reanimated");
// Import the new SwipeOverlay component
var SwipeOverlay_1 = require("../SwipeOverlay");
var SCREEN_WIDTH = react_native_1.Dimensions.get('window').width;
var SWIPE_THRESHOLD = 120;
var VELOCITY_THRESHOLD = 500;
var SwipeCard = function (_a) {
    var photo = _a.photo, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown;
    var translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    var translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var isDragging = (0, react_native_reanimated_1.useSharedValue)(false);
    var direction = (0, react_native_reanimated_1.useSharedValue)(null);
    // Calculate gesture distance for overlay opacity
    var gestureDistance = (0, react_native_reanimated_1.useDerivedValue)(function () {
        return Math.sqrt(translateX.value * translateX.value + translateY.value * translateY.value);
    });
    // Update direction when values change
    (0, react_native_reanimated_1.useDerivedValue)(function () {
        var absX = Math.abs(translateX.value);
        var absY = Math.abs(translateY.value);
        if (absX > absY) {
            direction.value = translateX.value > 0 ? 'right' : 'left';
        }
        else {
            direction.value = translateY.value > 0 ? 'down' : 'up';
        }
    });
    // Animated styles for the card
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        var rotation = (0, react_native_reanimated_1.interpolate)(translateX.value, [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2], [-15, 0, 15]);
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: "".concat(rotation, "deg") },
                { scale: scale.value }
            ],
        };
    });
    // Gesture handler with physics-based animations
    var gesture = react_native_gesture_handler_1.Gesture.Pan()
        .onStart(function () {
        isDragging.value = true;
        scale.value = (0, react_native_reanimated_1.withSpring)(1.05, { damping: 15, stiffness: 300 });
    })
        .onUpdate(function (event) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
    })
        .onEnd(function (event) {
        isDragging.value = false;
        var velocity = Math.sqrt(event.velocityX * event.velocityX + event.velocityY * event.velocityY);
        var distance = Math.sqrt(translateX.value * translateX.value + translateY.value * translateY.value);
        // Determine if swipe should complete based on distance or velocity
        var shouldComplete = distance > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;
        if (shouldComplete) {
            var absX = Math.abs(translateX.value);
            var absY = Math.abs(translateY.value);
            if (absX > absY) {
                // Horizontal swipe
                if (translateX.value > 0) {
                    // Swipe right - Keep
                    translateX.value = (0, react_native_reanimated_1.withSpring)(SCREEN_WIDTH * 1.5, {
                        velocity: event.velocityX,
                        damping: 12,
                        stiffness: 100,
                    }, function () {
                        if (onSwipeRight)
                            (0, react_native_reanimated_1.runOnJS)(onSwipeRight)();
                    });
                }
                else {
                    // Swipe left - Delete
                    translateX.value = (0, react_native_reanimated_1.withSpring)(-SCREEN_WIDTH * 1.5, {
                        velocity: event.velocityX,
                        damping: 12,
                        stiffness: 100,
                    }, function () {
                        if (onSwipeLeft)
                            (0, react_native_reanimated_1.runOnJS)(onSwipeLeft)();
                    });
                }
            }
            else {
                // Vertical swipe
                if (translateY.value < 0) {
                    // Swipe up - Share
                    translateY.value = (0, react_native_reanimated_1.withSpring)(-SCREEN_WIDTH * 1.5, {
                        velocity: event.velocityY,
                        damping: 12,
                        stiffness: 100,
                    }, function () {
                        if (onSwipeUp)
                            (0, react_native_reanimated_1.runOnJS)(onSwipeUp)();
                    });
                }
                else {
                    // Swipe down - Private
                    translateY.value = (0, react_native_reanimated_1.withSpring)(SCREEN_WIDTH * 1.5, {
                        velocity: event.velocityY,
                        damping: 12,
                        stiffness: 100,
                    }, function () {
                        if (onSwipeDown)
                            (0, react_native_reanimated_1.runOnJS)(onSwipeDown)();
                    });
                }
            }
        }
        else {
            // Spring back to center
            translateX.value = (0, react_native_reanimated_1.withSpring)(0, { damping: 15, stiffness: 300 });
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, { damping: 15, stiffness: 300 });
            scale.value = (0, react_native_reanimated_1.withSpring)(1, { damping: 15, stiffness: 300 });
        }
    });
    return (<react_native_gesture_handler_1.GestureDetector gesture={gesture}>
      <react_native_reanimated_1.default.View style={[styles.container, animatedStyle]}>
        <react_native_1.Image source={{ uri: photo.uri }} style={styles.image}/>
        
        {/* Directional overlays */}
        <SwipeOverlay_1.SwipeOverlay direction={direction} gestureDistance={gestureDistance} isDragging={isDragging}/>
      </react_native_reanimated_1.default.View>
    </react_native_gesture_handler_1.GestureDetector>);
};
exports.SwipeCard = SwipeCard;
var styles = react_native_1.StyleSheet.create({
    container: {
        width: 300,
        height: 400,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
