"use strict";
/**
 * App.tsx - Main React Native application component
 *
 * Root component that sets up navigation, providers, and core app structure.
 * Implements proper React Native patterns with TypeScript support.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var logError = function (error, context) { console.error("[".concat(context, "] Error:"), error); };
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var MediaLibrary = require("expo-media-library");
var Haptics = require("expo-haptics");
// UI Components
var SwipeCard_1 = require("./apps/mobile/src/ui/components/SwipeCard");
var TabNavigation_1 = require("./apps/mobile/src/ui/navigation/TabNavigation");
var PermissionScreen_1 = require("./apps/mobile/src/ui/screens/PermissionScreen");
var StatsScreen_1 = require("./apps/mobile/src/ui/screens/StatsScreen");
var SettingsScreen_1 = require("./apps/mobile/src/ui/screens/SettingsScreen");
var SpinWheel_1 = require("./apps/mobile/src/ui/components/SpinWheel");
// Sample data for development
var samplePhotos = [
    {
        id: '1',
        uri: 'https://images.pexels.com/photos/1804099/pexels-photo-1804099.jpeg?auto=compress&cs=tinysrgb&w=400',
        filename: 'sample1.jpg',
        width: 400,
        height: 600,
        fileSize: 150000,
        mimeType: 'image/jpeg',
        creationTime: Date.now() - 86400000,
        modificationTime: Date.now() - 86400000,
    },
    {
        id: '2',
        uri: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400',
        filename: 'sample2.jpg',
        width: 400,
        height: 600,
        fileSize: 200000,
        mimeType: 'image/jpeg',
        creationTime: Date.now() - 172800000,
        modificationTime: Date.now() - 172800000,
    },
    {
        id: '3',
        uri: 'https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=400',
        filename: 'sample3.jpg',
        width: 400,
        height: 600,
        fileSize: 180000,
        mimeType: 'image/jpeg',
        creationTime: Date.now() - 259200000,
        modificationTime: Date.now() - 259200000,
    },
];
var sortOptions = ['Oldest First', 'Newest First', 'Random', 'By Location'];
function App() {
    var _this = this;
    // State management
    var _a = (0, react_1.useState)(false), hasPermissions = _a[0], setHasPermissions = _a[1];
    var _b = (0, react_1.useState)('clean'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)(0), currentPhotoIndex = _c[0], setCurrentPhotoIndex = _c[1];
    var _d = (0, react_1.useState)(0), cleanedCount = _d[0], setCleanedCount = _d[1];
    var _e = (0, react_1.useState)('Oldest First'), sortOrder = _e[0], setSortOrder = _e[1];
    var _f = (0, react_1.useState)(false), showSortModal = _f[0], setShowSortModal = _f[1];
    var _g = (0, react_1.useState)(samplePhotos), photos = _g[0], setPhotos = _g[1];
    var _h = (0, react_1.useState)(false), isAnimating = _h[0], setIsAnimating = _h[1];
    var currentPhoto = photos[currentPhotoIndex];
    /**
     * Request media library permissions on app start
     */
    (0, react_1.useEffect)(function () {
        requestPermissions();
    }, []);
    /**
     * Requests necessary permissions for photo access
     */
    var requestPermissions = function () { return __awaiter(_this, void 0, void 0, function () {
        var status_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, MediaLibrary.requestPermissionsAsync()];
                case 1:
                    status_1 = (_a.sent()).status;
                    setHasPermissions(status_1 === 'granted');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logError(error_1, 'requestPermissions');
                    setHasPermissions(false);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Handles swipe actions on photos
     * @param direction - Swipe direction (left, right, up, down)
     */
    var handleSwipeAction = function (direction) { return __awaiter(_this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Provide haptic feedback
                return [4 /*yield*/, Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)];
                case 1:
                    // Provide haptic feedback
                    _a.sent();
                    setIsAnimating(true);
                    switch (direction) {
                        case 'left':
                            action = 'delete';
                            break;
                        case 'right':
                            action = 'keep';
                            break;
                        case 'up':
                            action = 'share';
                            break;
                        case 'down':
                            action = 'private';
                            break;
                        default:
                            action = 'keep';
                    }
                    // Log action (in production, this would update the backend)
                    console.log("Photo ".concat(currentPhoto.id, " action: ").concat(action));
                    // Update counters
                    setCleanedCount(function (prev) { return prev + 1; });
                    // Move to next photo after animation
                    setTimeout(function () {
                        setCurrentPhotoIndex(function (prev) { return (prev + 1) % photos.length; });
                        setIsAnimating(false);
                    }, 800);
                    return [2 /*return*/];
            }
        });
    }); };
    /**
     * Handles sort option selection
     * @param option - Selected sort option
     */
    var handleSortSelect = function (option) {
        setSortOrder(option);
        setShowSortModal(false);
        // Apply sorting logic (simplified for demo)
        var sortedPhotos = __spreadArray([], photos, true);
        switch (option) {
            case 'Newest First':
                sortedPhotos.sort(function (a, b) { return b.creationTime - a.creationTime; });
                break;
            case 'Oldest First':
                sortedPhotos.sort(function (a, b) { return a.creationTime - b.creationTime; });
                break;
            case 'Random':
                sortedPhotos.sort(function () { return Math.random() - 0.5; });
                break;
            case 'By Location':
                // Placeholder for location-based sorting
                break;
        }
        setPhotos(sortedPhotos);
        setCurrentPhotoIndex(0);
    };
    /**
     * Handles permission grant from permission screen
     */
    var handleGrantPermissions = function () {
        setHasPermissions(true);
    };
    // Show permission screen if permissions not granted
    if (!hasPermissions) {
        return (<react_native_gesture_handler_1.GestureHandlerRootView style={styles.container}>
        <react_native_1.StatusBar barStyle="dark-content" backgroundColor="#f8f9fa"/>
        <PermissionScreen_1.default />
      </react_native_gesture_handler_1.GestureHandlerRootView>);
    }
    // Render different screens based on active tab
    var renderScreen = function () {
        switch (activeTab) {
            case 'stats':
                return <StatsScreen_1.default />;
            case 'settings':
                return <SettingsScreen_1.default />;
            case 'gallery':
                return (<react_native_1.View style={styles.galleryContainer}>
            <react_native_1.Text style={styles.galleryTitle}>Gallery</react_native_1.Text>
            <react_native_1.Text style={styles.gallerySubtitle}>Photo grid will be implemented here</react_native_1.Text>
          </react_native_1.View>);
            case 'clean':
            default:
                return (<react_native_1.View style={styles.cleanContainer}>
            {/* Header */}
            <react_native_1.View style={styles.header}>
              <react_native_1.Text style={styles.counterText}>
                Total ({cleanedCount} Cleaned)
              </react_native_1.Text>
              <react_native_1.Text style={styles.sortButton} onPress={function () { return setShowSortModal(true); }}>
                {sortOrder}
              </react_native_1.Text>
            </react_native_1.View>

            {/* Main Card Area */}
            <react_native_1.View style={styles.cardContainer}>
              {currentPhoto && (<SwipeCard_1.SwipeCard photo={currentPhoto} onSwipeUp={function () { return handleSwipeAction("up"); }} onSwipeDown={function () { return handleSwipeAction("down"); }} onSwipeLeft={function () { return handleSwipeAction("left"); }} onSwipeRight={function () { return handleSwipeAction("right"); }}/>)}
            </react_native_1.View>

            {/* Progress Indicator */}
            <react_native_1.View style={styles.progressContainer}>
              <react_native_1.View style={styles.progressCard}>
                <react_native_1.View style={styles.progressHeader}>
                  <react_native_1.Text style={styles.progressLabel}>Progress</react_native_1.Text>
                  <react_native_1.Text style={styles.progressCount}>
                    {currentPhotoIndex + 1} / {photos.length}
                  </react_native_1.Text>
                </react_native_1.View>
                <react_native_1.View style={styles.progressBar}>
                  <react_native_1.View style={[
                        styles.progressFill,
                        { width: "".concat(((currentPhotoIndex + 1) / photos.length) * 100, "%") }
                    ]}/>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>);
        }
    };
    return (<react_native_gesture_handler_1.GestureHandlerRootView style={styles.container}>
      <react_native_1.StatusBar barStyle="dark-content" backgroundColor="#f8f9fa"/>
      <react_native_1.SafeAreaView style={styles.safeArea}>
        {renderScreen()}
        
        {/* Sort Modal */}
        {showSortModal && (<SpinWheel_1.SpinWheel options={sortOptions} selectedOption={sortOrder} onSelect={handleSortSelect} onClose={function () { return setShowSortModal(false); }}/>)}
        
        {/* Tab Navigation */}
        <TabNavigation_1.default activeTab={activeTab} onTabChange={setActiveTab}/>
      </react_native_1.SafeAreaView>
    </react_native_gesture_handler_1.GestureHandlerRootView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    safeArea: {
        flex: 1,
    },
    cleanContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    counterText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    sortButton: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e7',
        overflow: 'hidden',
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressContainer: {
        paddingBottom: 20,
    },
    progressCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    progressCount: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e5e5e7',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    galleryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    galleryTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    gallerySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});
