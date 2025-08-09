"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var SwipeCard_1 = require("./ui/components/SwipeCard");
var SpinWheel_1 = require("./ui/components/SpinWheel");
var TabNavigation_1 = require("./ui/navigation/TabNavigation");
var SortModal_1 = require("./ui/components/SortModal");
var mockPhotos = [
    {
        id: '1',
        uri: 'https://picsum.photos/400/600?random=1',
        width: 400,
        height: 600,
        date: new Date('2024-01-15'),
        size: 2048000,
    },
    {
        id: '2',
        uri: 'https://picsum.photos/400/600?random=2',
        width: 400,
        height: 600,
        date: new Date('2024-01-14'),
        size: 1536000,
    },
    {
        id: '3',
        uri: 'https://picsum.photos/400/600?random=3',
        width: 400,
        height: 600,
        date: new Date('2024-01-13'),
        size: 3072000,
    },
    {
        id: '4',
        uri: 'https://picsum.photos/400/600?random=4',
        width: 400,
        height: 600,
        date: new Date('2024-01-12'),
        size: 1024000,
    },
    {
        id: '5',
        uri: 'https://picsum.photos/400/600?random=5',
        width: 400,
        height: 600,
        date: new Date('2024-01-11'),
        size: 2560000,
    },
];
function App() {
    var _a = (0, react_1.useState)('clean'), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(mockPhotos), photos = _b[0], setPhotos = _b[1];
    var _c = (0, react_1.useState)(0), currentPhotoIndex = _c[0], setCurrentPhotoIndex = _c[1];
    var _d = (0, react_1.useState)(false), showSpinWheel = _d[0], setShowSpinWheel = _d[1];
    var _e = (0, react_1.useState)(false), showSortModal = _e[0], setShowSortModal = _e[1];
    var _f = (0, react_1.useState)('date'), sortBy = _f[0], setSortBy = _f[1];
    (0, react_1.useEffect)(function () {
        sortPhotos(sortBy);
    }, [sortBy]);
    var sortPhotos = function (sortType) {
        var sorted = __spreadArray([], mockPhotos, true);
        switch (sortType) {
            case 'date':
                sorted.sort(function (a, b) { return b.date.getTime() - a.date.getTime(); });
                break;
            case 'size':
                sorted.sort(function (a, b) { return b.size - a.size; });
                break;
            case 'recent':
                sorted.sort(function (a, b) { return b.date.getTime() - a.date.getTime(); });
                break;
            case 'random':
                sorted.sort(function () { return Math.random() - 0.5; });
                break;
        }
        setPhotos(sorted);
        setCurrentPhotoIndex(0);
    };
    var handleSwipeLeft = function () {
        // Move to next photo (delete action)
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
        else {
            setCurrentPhotoIndex(0);
        }
    };
    var handleSwipeRight = function () {
        // Move to next photo (keep action)
        if (currentPhotoIndex < photos.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
        else {
            setCurrentPhotoIndex(0);
        }
    };
    var handleSwipeUp = function () {
        // Show spin wheel
        setShowSpinWheel(true);
    };
    var handleSwipeDown = function () {
        // Show sort modal
        setShowSortModal(true);
    };
    var handleSpinWheelResult = function (result) {
        setShowSpinWheel(false);
        if (result === 'Random') {
            setSortBy('random');
        }
    };
    var renderContent = function () {
        switch (activeTab) {
            case 'clean':
                return (<react_native_1.View style={styles.contentContainer}>
            {currentPhotoIndex < photos.length && (<SwipeCard_1.SwipeCard photo={photos[currentPhotoIndex]} onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} onSwipeUp={handleSwipeUp} onSwipeDown={handleSwipeDown}/>)}
          </react_native_1.View>);
            case 'gallery':
                return (<react_native_1.View style={styles.contentContainer}>
            <react_native_1.Text style={styles.placeholderText}>Gallery View</react_native_1.Text>
          </react_native_1.View>);
            case 'stats':
                return (<react_native_1.View style={styles.contentContainer}>
            <react_native_1.Text style={styles.placeholderText}>Stats View</react_native_1.Text>
          </react_native_1.View>);
            case 'settings':
                return (<react_native_1.View style={styles.contentContainer}>
            <react_native_1.Text style={styles.placeholderText}>Settings View</react_native_1.Text>
          </react_native_1.View>);
            default:
                return null;
        }
    };
    return (<react_native_safe_area_context_1.SafeAreaProvider>
      <react_native_gesture_handler_1.GestureHandlerRootView style={styles.container}>
        <react_native_1.StatusBar barStyle="light-content" backgroundColor="#000000"/>
        <react_native_1.SafeAreaView style={styles.container}>
          <react_native_1.View style={styles.container}>
            {renderContent()}
            <TabNavigation_1.default activeTab={activeTab} onTabChange={setActiveTab}/>
          </react_native_1.View>
        </react_native_1.SafeAreaView>

        <SpinWheel_1.SpinWheel options={['Date', 'Size', 'Recent', 'Random']} selectedOption={sortBy} onSelect={handleSpinWheelResult} onClose={function () { return setShowSpinWheel(false); }}/>

        <SortModal_1.default visible={showSortModal} onClose={function () { return setShowSortModal(false); }} currentSort={sortBy} onSortChange={setSortBy}/>
      </react_native_gesture_handler_1.GestureHandlerRootView>
    </react_native_safe_area_context_1.SafeAreaProvider>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'SF Pro Display',
    },
});
