"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHapticFeedback = useHapticFeedback;
var Haptics = require("expo-haptics");
function useHapticFeedback() {
    var triggerHaptic = function (type) {
        if (type === void 0) { type = 'medium'; }
        switch (type) {
            case 'light':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                break;
            case 'medium':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                break;
            case 'heavy':
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                break;
            case 'success':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                break;
            case 'warning':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                break;
            case 'error':
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                break;
        }
    };
    return { triggerHaptic: triggerHaptic };
}
