"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var lucide_react_native_1 = require("lucide-react-native");
var tabs = [
    { id: 'clean', label: 'Clean', icon: lucide_react_native_1.Home },
    { id: 'gallery', label: 'Gallery', icon: lucide_react_native_1.Image },
    { id: 'stats', label: 'Stats', icon: lucide_react_native_1.BarChart3 },
    { id: 'settings', label: 'Settings', icon: lucide_react_native_1.Settings },
];
var TabNavigation = function (_a) {
    var activeTab = _a.activeTab, onTabChange = _a.onTabChange;
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.tabBar}>
        {tabs.map(function (tab) { return (<TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} onPress={function () { return onTabChange(tab.id); }}/>); })}
      </react_native_1.View>
    </react_native_1.View>);
};
var TabButton = function (_a) {
    var tab = _a.tab, isActive = _a.isActive, onPress = _a.onPress;
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    react_1.default.useEffect(function () {
        if (isActive) {
            scale.value = (0, react_native_reanimated_1.withSpring)(1.1, {
                damping: 15,
                stiffness: 200,
            });
            opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 200 });
        }
        else {
            scale.value = (0, react_native_reanimated_1.withSpring)(1, {
                damping: 15,
                stiffness: 200,
            });
            opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 200 });
        }
    }, [isActive]);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scale.value }],
    }); });
    var indicatorStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        opacity: opacity.value,
    }); });
    var Icon = tab.icon;
    return (<react_native_1.Pressable style={styles.tabButton} onPress={onPress} android_ripple={{ color: 'rgba(255, 255, 255, 0.1)', borderless: false }}>
      <react_native_reanimated_1.default.View style={[styles.tabContent, animatedStyle]}>
        <Icon size={24} color={isActive ? '#007AFF' : '#8E8E93'} strokeWidth={isActive ? 2.5 : 2}/>
        <react_native_1.Text style={[styles.tabLabel, { color: isActive ? '#007AFF' : '#8E8E93' }]}>
          {tab.label}
        </react_native_1.Text>
        <react_native_reanimated_1.default.View style={[styles.activeIndicator, indicatorStyle]}/>
      </react_native_reanimated_1.default.View>
    </react_native_1.Pressable>);
};
var styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1C1C1E',
        borderTopWidth: 1,
        borderTopColor: '#2C2C2E',
    },
    tabBar: {
        flexDirection: 'row',
        height: 83,
        paddingBottom: 34,
        backgroundColor: '#1C1C1E',
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
        fontFamily: 'SF Pro Display',
    },
    activeIndicator: {
        position: 'absolute',
        top: -8,
        width: 48,
        height: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
});
exports.default = TabNavigation;
