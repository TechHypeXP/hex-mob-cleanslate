/**
 * PhotoModel.ts - Core domain entity for photo management
 * 
 * Represents a photo item with all its properties and business logic.
 * Follows DDD principles with rich domain model containing behavior.
 */

export interface PhotoMetadata {
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  creationDate: Date;
  modificationDate: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export enum PhotoAction {
  KEEP = 'keep',
  DELETE = 'delete',
  SHARE = 'share',
  PRIVATE = 'private'
}

export enum PhotoStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  DELETED = 'deleted',
  SHARED = 'shared',
  PRIVATE = 'private'
}

/**
 * PhotoModel - Rich domain entity for photo management
 * Contains business logic and validation rules
 */
export class PhotoModel {
  constructor(
    public readonly id: string,
    public readonly uri: string,
    public readonly metadata: PhotoMetadata,
    public status: PhotoStatus = PhotoStatus.PENDING,
    public processedAt?: Date,
    public action?: PhotoAction
  ) {
    this.validatePhoto();
  }

  /**
   * Validates photo data integrity
   * @throws Error if photo data is invalid
   */
  private validatePhoto(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Photo ID cannot be empty');
    }
    
    if (!this.uri || this.uri.trim().length === 0) {
      throw new Error('Photo URI cannot be empty');
    }

    if (this.metadata.fileSize <= 0) {
      throw new Error('Photo file size must be greater than 0');
    }

    if (this.metadata.width <= 0 || this.metadata.height <= 0) {
      throw new Error('Photo dimensions must be greater than 0');
    }
  }

  /**
   * Processes photo with specified action
   * @param action - The action to perform on the photo
   * @returns Updated PhotoModel instance
   */
  public processWithAction(action: PhotoAction): PhotoModel {
    if (this.status === PhotoStatus.PROCESSED) {
      throw new Error('Photo has already been processed');
    }

    const newStatus = this.mapActionToStatus(action);
    
    return new PhotoModel(
      this.id,
      this.uri,
      this.metadata,
      newStatus,
      new Date(),
      action
    );
  }

  /**
   * Maps photo action to corresponding status
   * @param action - The action performed
   * @returns Corresponding PhotoStatus
   */
  private mapActionToStatus(action: PhotoAction): PhotoStatus {
    switch (action) {
      case PhotoAction.KEEP:
        return PhotoStatus.PROCESSED;
      case PhotoAction.DELETE:
        return PhotoStatus.DELETED;
      case PhotoAction.SHARE:
        return PhotoStatus.SHARED;
      case PhotoAction.PRIVATE:
        return PhotoStatus.PRIVATE;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Checks if photo can be processed
   * @returns True if photo can be processed
   */
  public canBeProcessed(): boolean {
    return this.status === PhotoStatus.PENDING;
  }

  /**
   * Gets human-readable file size
   * @returns Formatted file size string
   */
  public getFormattedFileSize(): string {
    const bytes = this.metadata.fileSize;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Gets photo aspect ratio
   * @returns Aspect ratio as number
   */
  public getAspectRatio(): number {
    return this.metadata.width / this.metadata.height;
  }

  /**
   * Checks if photo is landscape orientation
   * @returns True if landscape
   */
  public isLandscape(): boolean {
    return this.getAspectRatio() > 1;
  }

  /**
   * Checks if photo is portrait orientation
   * @returns True if portrait
   */
  public isPortrait(): boolean {
    return this.getAspectRatio() < 1;
  }

  /**
   * Checks if photo is square
   * @returns True if square (within tolerance)
   */
  public isSquare(tolerance: number = 0.1): boolean {
    const ratio = this.getAspectRatio();
    return Math.abs(ratio - 1) <= tolerance;
  }
}