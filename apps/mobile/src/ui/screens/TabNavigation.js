"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabNavigation;
var react_1 = require("react");
var bottom_tabs_1 = require("@react-navigation/bottom-tabs");
var vector_icons_1 = require("@expo/vector-icons");
var react_redux_1 = require("react-redux");
var react_native_1 = require("react-native");
// ✅ ALIASES ENFORCED - Use configured paths
var HomeScreen_1 = require("./HomeScreen");
var StatsScreen_1 = require("./StatsScreen");
var SettingsScreen_1 = require("./SettingsScreen");
var selectors_1 = require("../../application/store/selectors");
var Tab = (0, bottom_tabs_1.createBottomTabNavigator)();
function TabNavigation() {
    // ✅ MODERN: Redux Toolkit state management
    var streakCount = (0, react_redux_1.useSelector)(selectors_1.selectStreakCount);
    var badgeCount = (0, react_redux_1.useSelector)(selectors_1.selectBadgeCount);
    return (<Tab.Navigator id={undefined} screenOptions={function (_a) {
            var route = _a.route;
            return ({
                tabBarIcon: function (_a) {
                    var focused = _a.focused, color = _a.color, size = _a.size;
                    var iconName;
                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'card' : 'card-outline';
                            break;
                        case 'Stats':
                            iconName = focused ? 'trophy' : 'trophy-outline';
                            break;
                        case 'Settings':
                            iconName = focused ? 'settings' : 'settings-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }
                    return <vector_icons_1.Ionicons name={iconName} size={size} color={color}/>;
                },
                tabBarActiveTintColor: '#10B981',
                tabBarInactiveTintColor: '#64748B',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#E2E8F0',
                    paddingBottom: react_native_1.Platform.OS === 'ios' ? 20 : 5,
                    height: react_native_1.Platform.OS === 'ios' ? 90 : 60,
                },
                headerShown: false,
                tabBarHideOnKeyboard: true,
            });
        }}>
      <Tab.Screen name="Home" component={HomeScreen_1.default} options={{
            tabBarBadge: streakCount > 0 ? streakCount : undefined,
            tabBarBadgeStyle: { backgroundColor: '#EF4444', color: '#FFFFFF' },
        }}/>
      <Tab.Screen name="Stats" component={StatsScreen_1.default} options={{
            tabBarBadge: badgeCount > 0 ? badgeCount : undefined,
            tabBarBadgeStyle: { backgroundColor: '#8B5CF6', color: '#FFFFFF' },
        }}/>
      <Tab.Screen name="Settings" component={SettingsScreen_1.default}/>
    </Tab.Navigator>);
}
