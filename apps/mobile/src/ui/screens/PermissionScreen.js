"use strict";
/**
 * Permission Screen
 *
 * This screen handles photo library permission requests and displays
 * the current permission status to the user. It follows the DDD/Hexagonal
 * architecture by using the PhotoPermissionService for business logic
 * and Redux for state management.
 *
 * Architectural Boundaries:
 * - Uses PhotoPermissionService for permission logic (application layer)
 * - Uses Redux for state management (infrastructure layer)
 * - Handles UI presentation and user interaction (ui layer)
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
// Import application service
var PhotoPermissionService_1 = require("../../application/services/PhotoPermissionService");
// Import Redux actions and types
var permissionsSlice_1 = require("../../infrastructure/storage/redux/permissionsSlice");
// Import shared i18n utilities
var expo_media_library_1 = require("expo-media-library");
var PermissionScreen = function () {
    var t = (0, react_i18next_1.useTranslation)().t;
    var dispatch = (0, react_redux_1.useDispatch)();
    var _a = (0, react_redux_1.useSelector)(function (state) { return state.permissions; }), photoLibrary = _a.photoLibrary, loading = _a.loading, error = _a.error;
    // Initialize permission service
    var permissionService = new PhotoPermissionService_1.PhotoPermissionService();
    // Check current permissions on component mount
    (0, react_1.useEffect)(function () {
        checkPermissions();
    }, []);
    /**
     * Check current photo library permissions
     */
    var checkPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    dispatch((0, permissionsSlice_1.setLoading)(true));
                    return [4 /*yield*/, permissionService.checkPhotoPermissions()];
                case 1:
                    result = _a.sent();
                    dispatch((0, permissionsSlice_1.setPhotoLibraryPermission)(result));
                    return [3 /*break*/, 4];
                case 2:
                    err_1 = _a.sent();
                    dispatch((0, permissionsSlice_1.setError)('Failed to check permissions'));
                    console.error('Permission check error:', err_1);
                    return [3 /*break*/, 4];
                case 3:
                    dispatch((0, permissionsSlice_1.setLoading)(false));
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Request photo library permissions from user
     */
    var requestPermissions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    dispatch((0, permissionsSlice_1.setLoading)(true));
                    return [4 /*yield*/, permissionService.requestPhotoPermissions()];
                case 1:
                    result = _a.sent();
                    dispatch((0, permissionsSlice_1.setPhotoLibraryPermission)(result));
                    // Show appropriate message based on result
                    if (result.granted) {
                        react_native_1.Alert.alert(t('common.done'), t('permissions.grantButton') + ' ' + t('common.success'), [{ text: t('common.ok') }]);
                    }
                    else if (!result.canAskAgain) {
                        react_native_1.Alert.alert(t('permissions.title'), t('permissions.privacyNote') + ' ' + t('permissions.cannotAskAgain'), [{ text: t('common.ok') }]);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    err_2 = _a.sent();
                    dispatch((0, permissionsSlice_1.setError)('Failed to request permissions'));
                    console.error('Failed to request permissions:', err_2);
                    react_native_1.Alert.alert(t('common.error'), t('permissions.requestFailed'), [{ text: t('common.ok') }]);
                    return [3 /*break*/, 4];
                case 3:
                    dispatch((0, permissionsSlice_1.setLoading)(false));
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    /**
     * Render permission status message
     */
    var renderPermissionStatus = function () {
        if (loading) {
            return <react_native_1.Text style={styles.statusText}>{t('common.loading')}</react_native_1.Text>;
        }
        switch (photoLibrary.status) {
            case expo_media_library_1.PermissionStatus.GRANTED:
                return (<react_native_1.Text style={[styles.statusText, styles.grantedText]}>
            {t('permissions.status.granted')}
          </react_native_1.Text>);
            case expo_media_library_1.PermissionStatus.DENIED:
                return (<react_native_1.Text style={[styles.statusText, styles.deniedText]}>
            {t('permissions.status.denied')}
          </react_native_1.Text>);
            case expo_media_library_1.PermissionStatus.UNDETERMINED:
                return (<react_native_1.Text style={styles.statusText}>
            {t('permissions.status.undetermined')}
          </react_native_1.Text>);
            default:
                return (<react_native_1.Text style={styles.statusText}>
            {t('permissions.status.unknown')}
          </react_native_1.Text>);
        }
    };
    return (<react_native_1.ScrollView contentContainerStyle={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.Text style={styles.title}>{t('permissions.title')}</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>{t('permissions.subtitle')}</react_native_1.Text>
        
        <react_native_1.View style={styles.permissionCard}>
          <react_native_1.Text style={styles.permissionTitle}>{t('permissions.photoLibrary.title')}</react_native_1.Text>
          <react_native_1.Text style={styles.permissionDescription}>{t('permissions.photoLibrary.description')}</react_native_1.Text>
          {photoLibrary.status === expo_media_library_1.PermissionStatus.DENIED && !photoLibrary.canAskAgain && (<react_native_1.Text style={styles.warningText}>{t('permissions.cannotAskAgain')}</react_native_1.Text>)}
        </react_native_1.View>
        
        <react_native_1.View style={styles.statusContainer}>
          {renderPermissionStatus()}
        </react_native_1.View>
        
        {error && (<react_native_1.Text style={styles.errorText}>{error}</react_native_1.Text>)}
        
        <react_native_1.TouchableOpacity style={[
            styles.button,
            (photoLibrary.status === expo_media_library_1.PermissionStatus.DENIED && !photoLibrary.canAskAgain) && styles.disabledButton
        ]} onPress={requestPermissions} disabled={loading || (photoLibrary.status === expo_media_library_1.PermissionStatus.DENIED && !photoLibrary.canAskAgain)}>
          <react_native_1.Text style={styles.buttonText}>{t('permissions.grantButton')}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
        
        <react_native_1.Text style={styles.privacyNote}>{t('permissions.privacyNote')}</react_native_1.Text>
      </react_native_1.View>
    </react_native_1.ScrollView>);
};
// Styles
var styles = react_native_1.StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    permissionCard: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    permissionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    permissionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    warningText: {
        fontSize: 12,
        color: '#ff6b6b',
        fontStyle: 'italic',
    },
    statusContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    statusText: {
        fontSize: 16,
        textAlign: 'center',
    },
    grantedText: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    deniedText: {
        color: '#f44336',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#f44336',
        textAlign: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#2196f3',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 20,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    privacyNote: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
exports.default = PermissionScreen;
