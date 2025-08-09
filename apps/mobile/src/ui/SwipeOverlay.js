"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipeOverlay = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var expo_linear_gradient_1 = require("expo-linear-gradient");
var SwipeOverlay = function (_a) {
    var direction = _a.direction, gestureDistance = _a.gestureDistance, isDragging = _a.isDragging;
    var overlayStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        var opacity = (0, react_native_reanimated_1.interpolate)(gestureDistance.value, [0, 50, 100], [0, 0.4, 0.8], react_native_reanimated_1.Extrapolation.CLAMP);
        var scale = (0, react_native_reanimated_1.interpolate)(gestureDistance.value, [0, 50, 100], [0.8, 0.9, 1], react_native_reanimated_1.Extrapolation.CLAMP);
        return {
            opacity: isDragging.value ? opacity : 0,
            transform: [{ scale: scale }],
        };
    });
    var getOverlayColors = function () {
        var currentDirection = direction.value;
        switch (currentDirection) {
            case 'left':
                return ['#FF5252', '#FF1744'];
            case 'right':
                return ['#4CAF50', '#2E7D32'];
            case 'up':
                return ['#2196F3', '#1565C0'];
            case 'down':
                return ['#FF9800', '#E65100'];
            default:
                return ['transparent', 'transparent'];
        }
    };
    var getLabel = function () {
        var currentDirection = direction.value;
        switch (currentDirection) {
            case 'left':
                return 'NOPE';
            case 'right':
                return 'LIKE';
            case 'up':
                return 'SHARE';
            case 'down':
                return 'PRIVATE';
            default:
                return '';
        }
    };
    var getRotation = function () {
        var currentDirection = direction.value;
        switch (currentDirection) {
            case 'left':
                return '-15deg';
            case 'right':
                return '15deg';
            case 'up':
                return '-10deg';
            case 'down':
                return '10deg';
            default:
                return '0deg';
        }
    };
    var labelStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        var translateX = (0, react_native_reanimated_1.interpolate)(gestureDistance.value, [0, 100], [0, direction.value === 'left' ? -30 : direction.value === 'right' ? 30 : 0], react_native_reanimated_1.Extrapolation.CLAMP);
        return {
            transform: [
                { translateX: translateX },
                { rotate: getRotation() },
            ],
        };
    });
    if (!direction.value)
        return null;
    return (<react_native_reanimated_1.default.View style={[styles.overlay, overlayStyle]}>
      <expo_linear_gradient_1.LinearGradient colors={getOverlayColors()} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <react_native_reanimated_1.default.Text style={[styles.label, labelStyle]}>
          {getLabel()}
        </react_native_reanimated_1.default.Text>
      </expo_linear_gradient_1.LinearGradient>
    </react_native_reanimated_1.default.View>);
};
exports.SwipeOverlay = SwipeOverlay;
var styles = react_native_1.StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        letterSpacing: 4,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 8,
    },
});
