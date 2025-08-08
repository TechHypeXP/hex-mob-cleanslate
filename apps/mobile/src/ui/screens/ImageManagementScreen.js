"use strict";
/**
 * Image Management Screen
 *
 * This screen handles photo library management, including viewing, sorting,
 * selecting, and performing actions on photos. It follows the DDD/Hexagonal
 * architecture by using Redux for state management and i18n for localization.
 *
 * Architectural Boundaries:
 * - Uses Redux for state management (infrastructure layer)
 * - Uses i18n for localization (infrastructure layer)
 * - Handles UI presentation and user interaction (ui layer)
 * - Delegates business logic to application services
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_i18next_1 = require("react-i18next");
var react_redux_1 = require("react-redux");
// Import Redux actions and types
var photosSlice_1 = require("../../infrastructure/storage/redux/photosSlice");
// Import UI components
var SwipeCard_1 = require("../SwipeCard");
var ImageManagementScreen = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_redux_1.useSelector)(function (state) { return state.photos; }), photos = _a.photos, selectedPhotos = _a.selectedPhotos, loading = _a.loading, error = _a.error, sortBy = _a.sortBy, sortOrder = _a.sortOrder;
    // Load photos on component mount
    (0, react_1.useEffect)(function () {
        loadPhotos();
    }, []);
    /**
     * Load photos from photo library
     */
    var loadPhotos = function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockPhotos;
        return __generator(this, function (_a) {
            try {
                dispatch((0, photosSlice_1.setLoading)(true));
                mockPhotos = [
                    {
                        id: '1',
                        uri: 'https://picsum.photos/300/400?random=1',
                        filename: 'photo1.jpg',
                        width: 300,
                        height: 400,
                        fileSize: 1024000,
                        mimeType: 'image/jpeg',
                        creationTime: Date.now() - 86400000, // 1 day ago
                        modificationTime: Date.now() - 86400000,
                    },
                    {
                        id: '2',
                        uri: 'https://picsum.photos/300/400?random=2',
                        filename: 'photo2.jpg',
                        width: 300,
                        height: 400,
                        fileSize: 2048000,
                        mimeType: 'image/jpeg',
                        creationTime: Date.now() - 172800000, // 2 days ago
                        modificationTime: Date.now() - 172800000,
                    },
                    {
                        id: '3',
                        uri: 'https://picsum.photos/300/400?random=3',
                        filename: 'photo3.jpg',
                        width: 300,
                        height: 400,
                        fileSize: 1536000,
                        mimeType: 'image/jpeg',
                        creationTime: Date.now() - 259200000, // 3 days ago
                        modificationTime: Date.now() - 259200000,
                    }
                ];
                dispatch((0, photosSlice_1.setPhotos)(mockPhotos));
            }
            catch (err) {
                dispatch((0, photosSlice_1.setError)('Failed to load photos'));
                console.error('Photo loading error:', err);
            }
            finally {
                dispatch((0, photosSlice_1.setLoading)(false));
            }
            return [2 /*return*/];
        });
    }); };
    /**
     * Handle photo selection
     */
    var handlePhotoSelect = function (photoId) {
        if (selectedPhotos.includes(photoId)) {
            dispatch((0, photosSlice_1.deselectPhoto)(photoId));
        }
        else {
            dispatch((0, photosSlice_1.selectPhoto)(photoId));
        }
    };
    /**
     * Handle select all photos
     */
    var handleSelectAll = function () {
        if (selectedPhotos.length === photos.length) {
            dispatch((0, photosSlice_1.deselectAllPhotos)());
        }
        else {
            dispatch((0, photosSlice_1.selectAllPhotos)());
        }
    };
    /**
     * Handle sort option change
     */
    var handleSortChange = function (newSortBy) {
        var newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
        dispatch((0, photosSlice_1.setSortOptions)({ sortBy: newSortBy, sortOrder: newSortOrder }));
    };
    /**
     * Render photo item
     */
    var renderPhotoItem = function (_a) {
        var item = _a.item;
        return (<react_native_1.View style={styles.photoItem}>
        <SwipeCard_1.SwipeCard photo={item}/>
        <react_native_1.TouchableOpacity style={[
                styles.selectButton,
                selectedPhotos.includes(item.id) && styles.selectedButton
            ]} onPress={function () { return handlePhotoSelect(item.id); }}>
          <react_native_1.Text style={[
                styles.selectButtonText,
                selectedPhotos.includes(item.id) && styles.selectedButtonText
            ]}>
            {selectedPhotos.includes(item.id) ? t('common.selected') : t('common.select')}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    };
    /**
     * Render sort options
     */
    var renderSortOptions = function () {
        return (<react_native_1.View style={styles.sortContainer}>
        <react_native_1.Text style={styles.sortTitle}>{t('clean.sortButton', { sortOrder: t("sort.options.".concat(sortOrder === 'asc' ? 'oldestFirst' : 'newestFirst')) })}</react_native_1.Text>
        <react_native_1.View style={styles.sortButtons}>
          <react_native_1.TouchableOpacity style={styles.sortButton} onPress={function () { return handleSortChange('creationTime'); }}>
            <react_native_1.Text style={styles.sortButtonText}>
              {t('sort.options.oldestFirst')}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity style={styles.sortButton} onPress={function () { return handleSortChange('filename'); }}>
            <react_native_1.Text style={styles.sortButtonText}>
              {t('sort.options.byLocation')}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>
      </react_native_1.View>);
    };
    /**
     * Render header with selection controls
     */
    var renderHeader = function () {
        return (<react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.title}>{t('gallery.title')}</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>
          {t('gallery.totalImages', { selected: selectedPhotos.length })}
        </react_native_1.Text>
        
        <react_native_1.View style={styles.headerActions}>
          <react_native_1.TouchableOpacity style={styles.headerButton} onPress={handleSelectAll}>
            <react_native_1.Text style={styles.headerButtonText}>
              {selectedPhotos.length === photos.length ? t('common.deselect') : t('common.selectAll')}
            </react_native_1.Text>
          </react_native_1.TouchableOpacity>
          
          {selectedPhotos.length > 0 && (<react_native_1.TouchableOpacity style={[styles.headerButton, styles.actionButton]} onPress={function () { return react_native_1.Alert.alert(t('common.share'), t('gallery.selectPhotos')); }}>
              <react_native_1.Text style={styles.headerButtonText}>
                {t('common.share')}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>
      </react_native_1.View>);
    };
    /**
     * Render loading state
     */
    if (loading) {
        return (<react_native_1.View style={styles.centerContainer}>
        <react_native_1.Text style={styles.loadingText}>{t('common.loading')}</react_native_1.Text>
      </react_native_1.View>);
    }
    /**
     * Render error state
     */
    if (error) {
        return (<react_native_1.View style={styles.centerContainer}>
        <react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>
        <react_native_1.TouchableOpacity style={styles.retryButton} onPress={loadPhotos}>
          <react_native_1.Text style={styles.retryButtonText}>{t('common.retry')}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    return (<react_native_1.View style={styles.container}>
      {renderHeader()}
      {renderSortOptions()}
      
      <react_native_1.FlatList data={photos} renderItem={renderPhotoItem} keyExtractor={function (item) { return item.id; }} contentContainerStyle={styles.photoList} ListEmptyComponent={<react_native_1.View style={styles.centerContainer}>
            <react_native_1.Text style={styles.emptyText}>{t('gallery.title')}</react_native_1.Text>
          </react_native_1.View>}/>
    </react_native_1.View>);
};
// Styles
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 15,
    },
    headerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerButton: {
        backgroundColor: '#2196f3',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    actionButton: {
        backgroundColor: '#4caf50',
    },
    headerButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sortContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sortTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    sortButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sortButton: {
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 5,
    },
    sortButtonText: {
        fontSize: 14,
        color: '#333',
    },
    photoList: {
        padding: 10,
    },
    photoItem: {
        marginBottom: 20,
        alignItems: 'center',
    },
    selectButton: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        minWidth: 80,
    },
    selectedButton: {
        backgroundColor: '#2196f3',
    },
    selectButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedButtonText: {
        color: '#fff',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#f44336',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#2196f3',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
exports.default = ImageManagementScreen;
