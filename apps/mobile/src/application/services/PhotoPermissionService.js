"use strict";
/**
 * PhotoPermissionService - Application Service
 *
 * This service handles photo library permissions using Expo APIs.
 * It follows the DDD/Hexagonal architecture by separating business logic
 * from infrastructure concerns and providing a clean interface for UI layers.
 *
 * Architectural Boundaries:
 * - Exposes permission logic only (no UI concerns)
 * - Uses infrastructure adapters (Expo APIs) for platform-specific operations
 * - Returns structured results for UI layers to handle user interaction
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
exports.PhotoPermissionService = void 0;
var MediaLibrary = require("expo-media-library");
var expo_media_library_1 = require("expo-media-library");
/**
 * Photo Permission Service Implementation
 *
 * Handles photo library permissions for both iOS and Android platforms.
 * Follows privacy best practices by only requesting necessary permissions
 * and providing clear status information to UI layers.
 */
var PhotoPermissionService = /** @class */ (function () {
    function PhotoPermissionService() {
    }
    /**
     * Request photo library permissions from the user
     *
     * This method will show the platform-specific permission dialog
     * to request access to the photo library.
     *
     * @returns Promise<PermissionResult> - Permission status and metadata
     */
    PhotoPermissionService.prototype.requestPhotoPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status_1, canAskAgain, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, MediaLibrary.requestPermissionsAsync()];
                    case 1:
                        _a = _b.sent(), status_1 = _a.status, canAskAgain = _a.canAskAgain;
                        return [2 /*return*/, {
                                status: status_1,
                                canAskAgain: canAskAgain,
                                granted: status_1 === expo_media_library_1.PermissionStatus.GRANTED
                            }];
                    case 2:
                        error_1 = _b.sent();
                        // Log permission request errors (privacy-safe)
                        console.warn('Permission request failed:', error_1);
                        return [2 /*return*/, {
                                status: expo_media_library_1.PermissionStatus.UNDETERMINED,
                                canAskAgain: true,
                                granted: false
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Check current photo library permission status
     *
     * This method checks the current permission status without
     * showing any permission dialogs to the user.
     *
     * @returns Promise<PermissionResult> - Current permission status and metadata
     */
    PhotoPermissionService.prototype.checkPhotoPermissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, status_2, canAskAgain, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, MediaLibrary.getPermissionsAsync()];
                    case 1:
                        _a = _b.sent(), status_2 = _a.status, canAskAgain = _a.canAskAgain;
                        return [2 /*return*/, {
                                status: status_2,
                                canAskAgain: canAskAgain,
                                granted: status_2 === expo_media_library_1.PermissionStatus.GRANTED
                            }];
                    case 2:
                        error_2 = _b.sent();
                        // Log permission check errors (privacy-safe)
                        console.error('Permission check error:', error_2);
                        return [2 /*return*/, {
                                status: expo_media_library_1.PermissionStatus.UNDETERMINED,
                                canAskAgain: true,
                                granted: false
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return PhotoPermissionService;
}());
exports.PhotoPermissionService = PhotoPermissionService;
