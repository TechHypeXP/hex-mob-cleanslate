"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var lucide_react_native_1 = require("lucide-react-native");
var sortOptions = [
    {
        id: 'date',
        label: 'Date Taken',
        icon: lucide_react_native_1.Calendar,
        description: 'Sort by when photos were taken',
    },
    {
        id: 'size',
        label: 'File Size',
        icon: lucide_react_native_1.Aperture,
        description: 'Sort by file size (largest first)',
    },
    {
        id: 'recent',
        label: 'Recently Added',
        icon: lucide_react_native_1.Clock,
        description: 'Sort by when photos were added',
    },
    {
        id: 'random',
        label: 'Random',
        icon: lucide_react_native_1.Shuffle,
        description: 'Randomize photo order',
    },
];
var SortModal = function (_a) {
    var visible = _a.visible, onClose = _a.onClose, currentSort = _a.currentSort, onSortChange = _a.onSortChange;
    var translateY = (0, react_native_reanimated_1.useSharedValue)(400);
    var opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    react_1.default.useEffect(function () {
        if (visible) {
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, {
                damping: 25,
                stiffness: 200,
            });
            opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 200 });
        }
        else {
            translateY.value = (0, react_native_reanimated_1.withSpring)(400, {
                damping: 25,
                stiffness: 200,
            });
            opacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 200 });
        }
    }, [visible]);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ translateY: translateY.value }],
    }); });
    var backdropStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        opacity: opacity.value,
    }); });
    return (<react_native_1.Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <react_native_reanimated_1.default.View style={[styles.backdrop, backdropStyle]}>
        <react_native_1.Pressable style={styles.backdropPressable} onPress={onClose}/>
      </react_native_reanimated_1.default.View>

      <react_native_reanimated_1.default.View style={[styles.container, animatedStyle]}>
        <react_native_1.View style={styles.header}>
          <react_native_1.Text style={styles.title}>Sort Photos</react_native_1.Text>
          <react_native_1.Pressable onPress={onClose} style={styles.closeButton}>
            <lucide_react_native_1.X size={24} color="#FFFFFF"/>
          </react_native_1.Pressable>
        </react_native_1.View>

        <react_native_1.ScrollView style={styles.content}>
          {sortOptions.map(function (option) { return (<SortOptionItem key={option.id} option={option} isSelected={currentSort === option.id} onPress={function () {
                onSortChange(option.id);
                onClose();
            }}/>); })}
        </react_native_1.ScrollView>
      </react_native_reanimated_1.default.View>
    </react_native_1.Modal>);
};
var SortOptionItem = function (_a) {
    var option = _a.option, isSelected = _a.isSelected, onPress = _a.onPress;
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ scale: scale.value }],
    }); });
    var handlePressIn = function () {
        scale.value = (0, react_native_reanimated_1.withSpring)(0.95, {
            damping: 20,
            stiffness: 300,
        });
    };
    var handlePressOut = function () {
        scale.value = (0, react_native_reanimated_1.withSpring)(1, {
            damping: 20,
            stiffness: 300,
        });
    };
    var Icon = option.icon;
    return (<react_native_1.Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.optionContainer}>
      <react_native_reanimated_1.default.View style={[styles.optionContent, animatedStyle]}>
        <react_native_1.View style={styles.optionLeft}>
          <react_native_1.View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
            <Icon size={20} color={isSelected ? '#007AFF' : '#8E8E93'}/>
          </react_native_1.View>
          <react_native_1.View style={styles.textContainer}>
            <react_native_1.Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
              {option.label}
            </react_native_1.Text>
            <react_native_1.Text style={styles.optionDescription}>{option.description}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
        {isSelected && <react_native_1.View style={styles.selectedIndicator}/>}
      </react_native_reanimated_1.default.View>
    </react_native_1.Pressable>);
};
var styles = react_native_1.StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdropPressable: {
        flex: 1,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1C1C1E',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'SF Pro Display',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        paddingVertical: 8,
    },
    optionContainer: {
        paddingHorizontal: 20,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2C2C2E',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2C2C2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainerSelected: {
        backgroundColor: '#007AFF20',
    },
    textContainer: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'SF Pro Display',
    },
    optionLabelSelected: {
        color: '#007AFF',
    },
    optionDescription: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 2,
        fontFamily: 'SF Pro Display',
    },
    selectedIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
exports.default = SortModal;
