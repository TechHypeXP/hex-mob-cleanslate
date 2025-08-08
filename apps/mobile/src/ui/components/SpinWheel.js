"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinWheel = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var lucide_react_native_1 = require("lucide-react-native");
var screenWidth = react_native_1.Dimensions.get('window').width;
var WHEEL_SIZE = Math.min(screenWidth - 48, 280);
var CENTER_SIZE = 32;
var SpinWheel = function (_a) {
    var options = _a.options, selectedOption = _a.selectedOption, onSelect = _a.onSelect, onClose = _a.onClose;
    var _b = (0, react_1.useState)(false), isSpinning = _b[0], setIsSpinning = _b[1];
    var rotation = (0, react_native_reanimated_1.useSharedValue)(0);
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var segmentAngle = 360 / options.length;
    var handleSpin = function () {
        if (isSpinning)
            return;
        setIsSpinning(true);
        // Bias towards "Random" (50% chance) - preserving legacy behavior
        var randomIndex = Math.random() < 0.5 && options.includes('Random')
            ? options.indexOf('Random')
            : Math.floor(Math.random() * options.length);
        var spins = 5 + Math.random() * 3; // 5-8 full rotations
        var finalRotation = rotation.value + (spins * 360) + (randomIndex * segmentAngle);
        rotation.value = (0, react_native_reanimated_1.withSpring)(finalRotation, {
            damping: 15,
            stiffness: 100,
            mass: 1,
            velocity: 0,
        }, function (finished) {
            if (finished) {
                (0, react_native_reanimated_1.runOnJS)(setIsSpinning)(false);
                (0, react_native_reanimated_1.runOnJS)(onSelect)(options[randomIndex]);
            }
        });
    };
    var handleManualSelect = function (option, index) {
        if (isSpinning)
            return;
        var targetRotation = rotation.value + (index * segmentAngle) - (rotation.value % 360);
        rotation.value = (0, react_native_reanimated_1.withTiming)(targetRotation, { duration: 500 }, function (finished) {
            if (finished) {
                (0, react_native_reanimated_1.runOnJS)(onSelect)(option);
            }
        });
    };
    var wheelStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ rotate: "".concat(rotation.value, "deg") }],
    }); });
    var spinButtonStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scale.value }],
        opacity: isSpinning ? 0.7 : 1,
    }); });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.modal}>
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Sort Photos</react_native_1.Text>
          <react_native_1.Text style={styles.subtitle}>Choose your sorting preference</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.wheelContainer}>
          {/* Pointer */}
          <react_native_1.View style={styles.pointer}/>

          {/* Wheel */}
          <react_native_reanimated_1.default.View style={[styles.wheel, wheelStyle]}>
            {options.map(function (option, index) {
            var angle = index * segmentAngle;
            var isSelected = option === selectedOption;
            return (<react_native_1.Pressable key={option} onPress={function () { return handleManualSelect(option, index); }} disabled={isSpinning} style={[
                    styles.segment,
                    {
                        transform: [{ rotate: "".concat(angle, "deg") }],
                        backgroundColor: isSelected ? '#3B82F6' : '#F3F4F6',
                    },
                ]}>
                  <react_native_1.Text style={[
                    styles.segmentText,
                    {
                        color: isSelected ? '#FFFFFF' : '#374151',
                        transform: [{ rotate: "".concat(-angle, "deg") }],
                    },
                ]}>
                    {option}
                  </react_native_1.Text>
                </react_native_1.Pressable>);
        })}
          </react_native_reanimated_1.default.View>

          {/* Center Circle */}
          <react_native_1.View style={styles.centerCircle}/>
        </react_native_1.View>

        {/* Feeling Lucky Button */}
        <react_native_reanimated_1.default.View style={[styles.spinButtonContainer, spinButtonStyle]}>
          <react_native_1.Pressable onPress={handleSpin} disabled={isSpinning} style={function (_a) {
            var pressed = _a.pressed;
            return [
                styles.spinButton,
                pressed && styles.spinButtonPressed,
                isSpinning && styles.spinButtonDisabled,
            ];
        }}>
            <lucide_react_native_1.RotateCcw size={20} color="#FFFFFF" style={[isSpinning && styles.spinIcon]}/>
            <react_native_1.Text style={styles.spinButtonText}>
              {isSpinning ? 'Spinning...' : 'Feeling Lucky?'}
            </react_native_1.Text>
          </react_native_1.Pressable>
        </react_native_reanimated_1.default.View>

        <react_native_1.Pressable onPress={onClose} disabled={isSpinning} style={function (_a) {
            var pressed = _a.pressed;
            return [
                styles.cancelButton,
                pressed && styles.cancelButtonPressed,
                isSpinning && styles.cancelButtonDisabled,
            ];
        }}>
          <react_native_1.Text style={styles.cancelButtonText}>Cancel</react_native_1.Text>
        </react_native_1.Pressable>
      </react_native_1.View>
    </react_native_1.View>);
};
exports.SpinWheel = SpinWheel;
var styles = react_native_1.StyleSheet.create({
    container: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' }),
    modal: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        marginHorizontal: 24,
        width: '100%',
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
    },
    wheelContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    pointer: {
        position: 'absolute',
        top: -8,
        left: '50%',
        marginLeft: -4,
        width: 0,
        height: 0,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#3B82F6',
        zIndex: 10,
    },
    wheel: {
        width: WHEEL_SIZE,
        height: WHEEL_SIZE,
        borderRadius: WHEEL_SIZE / 2,
        backgroundColor: '#F9FAFB',
        borderWidth: 4,
        borderColor: '#E5E7EB',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    segment: {
        position: 'absolute',
        width: '50%',
        height: '50%',
        top: 0,
        left: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: WHEEL_SIZE / 2,
        borderBottomRightRadius: 0,
    },
    segmentText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    centerCircle: {
        position: 'absolute',
        width: CENTER_SIZE,
        height: CENTER_SIZE,
        borderRadius: CENTER_SIZE / 2,
        backgroundColor: '#3B82F6',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    spinButtonContainer: {
        marginBottom: 16,
    },
    spinButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8B5CF6',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    spinButtonPressed: {
        transform: [{ scale: 0.98 }],
    },
    spinButtonDisabled: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
        elevation: 0,
    },
    spinButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    spinIcon: {
        transform: [{ rotate: '360deg' }],
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonPressed: {
        backgroundColor: '#E5E7EB',
    },
    cancelButtonDisabled: {
        backgroundColor: '#F9FAFB',
        opacity: 0.7,
    },
    cancelButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
});
