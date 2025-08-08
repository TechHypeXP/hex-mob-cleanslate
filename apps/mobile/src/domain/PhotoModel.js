"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoModel = void 0;
var PhotoModel = /** @class */ (function () {
    function PhotoModel(id, uri, createdAt, isFavorite, tags, metadata) {
        if (createdAt === void 0) { createdAt = new Date(); }
        if (isFavorite === void 0) { isFavorite = false; }
        if (tags === void 0) { tags = []; }
        this.id = id;
        this.uri = uri;
        this.createdAt = createdAt;
        this.isFavorite = isFavorite;
        this.tags = tags;
        this.metadata = metadata;
    }
    // Domain methods
    PhotoModel.prototype.toggleFavorite = function () {
        this.isFavorite = !this.isFavorite;
    };
    PhotoModel.prototype.addTag = function (tag) {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
        }
    };
    PhotoModel.prototype.removeTag = function (tag) {
        this.tags = this.tags.filter(function (t) { return t !== tag; });
    };
    return PhotoModel;
}());
exports.PhotoModel = PhotoModel;
