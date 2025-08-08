"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoModel = void 0;
var PhotoModel = /** @class */ (function () {
    function PhotoModel(id, uri, filename, width, height, fileSize, mimeType, creationTime, modificationTime, albumId, location, exif) {
        this.id = id;
        this.uri = uri;
        this.filename = filename;
        this.width = width;
        this.height = height;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.creationTime = creationTime;
        this.modificationTime = modificationTime;
        this.albumId = albumId;
        this.location = location;
        this.exif = exif;
    }
    return PhotoModel;
}());
exports.PhotoModel = PhotoModel;
