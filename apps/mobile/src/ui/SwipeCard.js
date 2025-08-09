"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipeCard = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
// Import icons for directional overlays
var lucide_react_native_1 = require("lucide-react-native");
var SwipeCard = function (_a) {
    var photo = _a.photo, onSwipeLeft = _a.onSwipeLeft, onSwipeRight = _a.onSwipeRight, onSwipeUp = _a.onSwipeUp, onSwipeDown = _a.onSwipeDown;
    var pan = (0, react_1.useState)(new react_native_1.Animated.ValueXY())[0];
    var _b = (0, react_1.useState)(false), isDragging = _b[0], setIsDragging = _b[1];
    // Create pan responder for swipe gestures
    var panResponder = react_1.default.useRef(react_native_1.PanResponder.create({
        onStartShouldSetPanResponder: function () { return true; },
        onPanResponderGrant: function () {
            setIsDragging(true);
            pan.flattenOffset();
            pan.setOffset({ x: 0, y: 0 });
        },
        onPanResponderMove: react_native_1.Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
        onPanResponderRelease: function (evt, gestureState) {
            setIsDragging(false);
            var dx = gestureState.dx, dy = gestureState.dy;
            var swipeThreshold = 100;
            var velocityThreshold = 500;
            // Determine swipe direction based on gesture
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal swipe
                if (dx > swipeThreshold || gestureState.vx > velocityThreshold) {
                    // Swipe right - Keep
                    if (onSwipeRight) {
                        react_native_1.Animated.spring(pan, {
                            toValue: { x: 500, y: 0 },
                            useNativeDriver: false,
                            speed: 20,
                            bounciness: 0
                        }).start(function () {
                            onSwipeRight();
                            pan.setValue({ x: 0, y: 0 });
                        });
                    }
                }
                else if (dx < -swipeThreshold || gestureState.vx < -velocityThreshold) {
                    // Swipe left - Delete
                    if (onSwipeLeft) {
                        react_native_1.Animated.spring(pan, {
                            toValue: { x: -500, y: 0 },
                            useNativeDriver: false,
                            speed: 20,
                            bounciness: 0
                        }).start(function () {
                            onSwipeLeft();
                            pan.setValue({ x: 0, y: 0 });
                        });
                    }
                }
                else {
                    // Not enough velocity, spring back
                    react_native_1.Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                        speed: 10,
                        bounciness: 10
                    }).start();
                }
            }
            else {
                // Vertical swipe
                if (dy < -swipeThreshold || gestureState.vy < -velocityThreshold) {
                    // Swipe up - Share
                    if (onSwipeUp) {
                        react_native_1.Animated.spring(pan, {
                            toValue: { x: 0, y: -500 },
                            useNativeDriver: false,
                            speed: 20,
                            bounciness: 0
                        }).start(function () {
                            onSwipeUp();
                            pan.setValue({ x: 0, y: 0 });
                        });
                    }
                }
                else if (dy > swipeThreshold || gestureState.vy > velocityThreshold) {
                    // Swipe down - Private
                    if (onSwipeDown) {
                        react_native_1.Animated.spring(pan, {
                            toValue: { x: 0, y: 500 },
                            useNativeDriver: false,
                            speed: 20,
                            bounciness: 0
                        }).start(function () {
                            onSwipeDown();
                            pan.setValue({ x: 0, y: 0 });
                        });
                    }
                }
                else {
                    // Not enough velocity, spring back
                    react_native_1.Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                        speed: 10,
                        bounciness: 10
                    }).start();
                }
            }
        }
    })).current;
    // Calculate rotation based on horizontal movement
    var rotate = pan.x.interpolate({
        inputRange: [-200, 200],
        outputRange: ['-15deg', '15deg'],
        extrapolate: 'clamp'
    });
    // Calculate opacity based on distance from center
    var opacity = pan.x.interpolate({
        inputRange: [-300, 0, 300],
        outputRange: [0.4, 1, 0.4],
        extrapolate: 'clamp'
    });
    // Calculate scale based on distance from center
    var scale = pan.x.interpolate({
        inputRange: [-500, 0, 500],
        outputRange: [0.8, 1, 0.8],
        extrapolate: 'clamp'
    });
    // Calculate directional overlay opacities
    var deleteOpacity = pan.x.interpolate({
        inputRange: [-150, -50, 0],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp'
    });
    var keepOpacity = pan.x.interpolate({
        inputRange: [0, 50, 150],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
    });
    var shareOpacity = pan.y.interpolate({
        inputRange: [-150, -50, 0],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp'
    });
    var privateOpacity = pan.y.interpolate({
        inputRange: [0, 50, 150],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp'
    });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Animated.View {...panResponder.panHandlers} style={[
            styles.card,
            {
                transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { rotate: rotate },
                    { scale: scale }
                ],
                opacity: opacity
            }
        ]}>
        <react_native_1.Image source={{ uri: photo.uri }} style={styles.image}/>
        
        {/* Directional Overlays */}
        {isDragging && (<>
            {/* Delete (Left) */}
            <react_native_1.Animated.View style={[styles.overlay, styles.deleteOverlay, { opacity: deleteOpacity }]}>
              <react_native_1.View style={styles.overlayIconContainer}>
                <lucide_react_native_1.Trash2 size={48} color="#fff"/>
              </react_native_1.View>
            </react_native_1.Animated.View>

            {/* Keep (Right) */}
            <react_native_1.Animated.View style={[styles.overlay, styles.keepOverlay, { opacity: keepOpacity }]}>
              <react_native_1.View style={styles.overlayIconContainer}>
                <lucide_react_native_1.Heart size={48} color="#fff"/>
              </react_native_1.View>
            </react_native_1.Animated.View>

            {/* Share (Up) */}
            <react_native_1.Animated.View style={[styles.overlay, styles.shareOverlay, { opacity: shareOpacity }]}>
              <react_native_1.View style={styles.overlayIconContainer}>
                <lucide_react_native_1.Share2 size={48} color="#fff"/>
              </react_native_1.View>
            </react_native_1.Animated.View>

            {/* Private (Down) */}
            <react_native_1.Animated.View style={[styles.overlay, styles.privateOverlay, { opacity: privateOpacity }]}>
              <react_native_1.View style={styles.overlayIconContainer}>
                <lucide_react_native_1.Lock size={48} color="#fff"/>
              </react_native_1.View>
            </react_native_1.Animated.View>
          </>)}
      </react_native_1.Animated.View>
    </react_native_1.View>);
};
exports.SwipeCard = SwipeCard;
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: 300,
        height: 400,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteOverlay: {
        backgroundColor: 'rgba(239, 68, 68, 0.8)' // red-500 with opacity
    },
    keepOverlay: {
        backgroundColor: 'rgba(34, 197, 94, 0.8)' // green-500 with opacity
    },
    shareOverlay: {
        backgroundColor: 'rgba(59, 130, 246, 0.8)' // blue-500 with opacity
    },
    privateOverlay: {
        backgroundColor: 'rgba(147, 51, 234, 0.8)' // purple-500 with opacity
    },
    overlayIconContainer: {
        backgroundColor: '#fff',
        borderRadius: 9999,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8
    }
});
