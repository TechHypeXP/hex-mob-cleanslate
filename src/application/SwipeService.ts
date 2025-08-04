/**
 * SwipeService.ts - Application service for swipe gesture handling
 * 
 * Implements CQRS pattern with commands and queries for swipe operations.
 * Coordinates between UI gestures and domain logic.
 */

import { PhotoModel, PhotoAction } from '../domain/PhotoModel';
import { GamificationEntity, GamificationEvent } from '../domain/GamificationEntity';

export interface SwipeCommand {
  photoId: string;
  direction: 'left' | 'right' | 'up' | 'down';
  velocity: number;
  timestamp: Date;
}

export interface SwipeResult {
  success: boolean;
  action: PhotoAction;
  points: number;
  newLevel?: number;
  achievementUnlocked?: string;
  error?: string;
}

export interface SwipeQuery {
  photoId: string;
}

export interface SwipeQueryResult {
  photo: PhotoModel;
  canSwipe: boolean;
  suggestedAction?: PhotoAction;
}

/**
 * SwipeService - Application service implementing CQRS for swipe operations
 * Handles command processing and query execution for swipe gestures
 */
export class SwipeService {
  private static readonly VELOCITY_THRESHOLD = 500; // pixels per second
  private static readonly DISTANCE_THRESHOLD = 100; // pixels

  constructor(
    private photoRepository: PhotoRepository,
    private gamificationRepository: GamificationRepository,
    private analyticsService: AnalyticsService
  ) {}

  /**
   * Executes swipe command and processes the gesture
   * @param command - Swipe command to execute
   * @returns Promise<SwipeResult> - Result of swipe operation
   */
  async executeSwipeCommand(command: SwipeCommand): Promise<SwipeResult> {
    try {
      // Validate command
      this.validateSwipeCommand(command);

      // Get photo from repository
      const photo = await this.photoRepository.getById(command.photoId);
      if (!photo) {
        return {
          success: false,
          action: PhotoAction.KEEP,
          points: 0,
          error: 'Photo not found'
        };
      }

      // Check if photo can be processed
      if (!photo.canBeProcessed()) {
        return {
          success: false,
          action: PhotoAction.KEEP,
          points: 0,
          error: 'Photo has already been processed'
        };
      }

      // Map swipe direction to action
      const action = this.mapDirectionToAction(command.direction);

      // Process photo with action
      const processedPhoto = photo.processWithAction(action);

      // Update photo in repository
      await this.photoRepository.update(processedPhoto);

      // Update gamification
      const gamification = await this.gamificationRepository.getByUserId('current-user');
      const updatedGamification = gamification.processEvent(
        GamificationEvent.PHOTO_PROCESSED,
        { action: action }
      );
      await this.gamificationRepository.update(updatedGamification);

      // Track analytics
      await this.analyticsService.trackSwipe({
        photoId: command.photoId,
        action,
        direction: command.direction,
        velocity: command.velocity,
        timestamp: command.timestamp
      });

      // Check for level up
      const levelUp = updatedGamification.currentLevel > gamification.currentLevel;

      return {
        success: true,
        action,
        points: 10, // Base points, could be calculated from gamification
        newLevel: levelUp ? updatedGamification.currentLevel : undefined
      };

    } catch (error) {
      return {
        success: false,
        action: PhotoAction.KEEP,
        points: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Executes query to get swipe information for a photo
   * @param query - Swipe query to execute
   * @returns Promise<SwipeQueryResult> - Query result
   */
  async executeSwipeQuery(query: SwipeQuery): Promise<SwipeQueryResult> {
    try {
      const photo = await this.photoRepository.getById(query.photoId);
      
      if (!photo) {
        throw new Error('Photo not found');
      }

      const canSwipe = photo.canBeProcessed();
      const suggestedAction = await this.getSuggestedAction(photo);

      return {
        photo,
        canSwipe,
        suggestedAction
      };

    } catch (error) {
      logError(error, 'executeSwipeQuery');
      throw new Error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates swipe command parameters
   * @param command - Command to validate
   * @throws Error if command is invalid
   */
  private validateSwipeCommand(command: SwipeCommand): void {
    if (!command.photoId || command.photoId.trim().length === 0) {
      throw new Error('Photo ID is required');
    }

    if (!['left', 'right', 'up', 'down'].includes(command.direction)) {
      throw new Error('Invalid swipe direction');
    }

    if (command.velocity < 0) {
      throw new Error('Velocity cannot be negative');
    }

    if (!command.timestamp) {
      throw new Error('Timestamp is required');
    }
  }

  /**
   * Maps swipe direction to photo action
   * @param direction - Swipe direction
   * @returns Corresponding PhotoAction
   */
  private mapDirectionToAction(direction: string): PhotoAction {
    switch (direction) {
      case 'left':
        return PhotoAction.DELETE;
      case 'right':
        return PhotoAction.KEEP;
      case 'up':
        return PhotoAction.SHARE;
      case 'down':
        return PhotoAction.PRIVATE;
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }
  }

  /**
   * Gets AI-suggested action for a photo based on analysis
   * @param photo - Photo to analyze
   * @returns Promise<PhotoAction> - Suggested action
   */
  private async getSuggestedAction(photo: PhotoModel): Promise<PhotoAction> {
    // Placeholder for ML-based suggestion logic
    // Could analyze photo content, user patterns, etc.
    
    // Simple heuristic: suggest delete for very small or very large files
    if (photo.metadata.fileSize < 50000) { // < 50KB
      return PhotoAction.DELETE;
    }
    
    if (photo.metadata.fileSize > 10000000) { // > 10MB
      return PhotoAction.KEEP;
    }

    // Default suggestion
    return PhotoAction.KEEP;
  }

  /**
   * Checks if swipe gesture meets minimum requirements
   * @param velocity - Swipe velocity
   * @param distance - Swipe distance
   * @returns True if gesture is valid
   */
  public isValidSwipeGesture(velocity: number, distance: number): boolean {
    return velocity >= SwipeService.VELOCITY_THRESHOLD || 
           distance >= SwipeService.DISTANCE_THRESHOLD;
  }

  /**
   * Calculates swipe confidence based on gesture metrics
   * @param velocity - Swipe velocity
   * @param distance - Swipe distance
   * @returns Confidence score (0-1)
   */
  public calculateSwipeConfidence(velocity: number, distance: number): number {
    const velocityScore = Math.min(1, velocity / (SwipeService.VELOCITY_THRESHOLD * 2));
    const distanceScore = Math.min(1, distance / (SwipeService.DISTANCE_THRESHOLD * 2));
    
    return (velocityScore + distanceScore) / 2;
  }
}

// Repository interfaces (to be implemented in infrastructure layer)
export interface PhotoRepository {
  getById(id: string): Promise<PhotoModel | null>;
  update(photo: PhotoModel): Promise<void>;
  getAll(): Promise<PhotoModel[]>;
  delete(id: string): Promise<void>;
}

export interface GamificationRepository {
  getByUserId(userId: string): Promise<GamificationEntity>;
  update(gamification: GamificationEntity): Promise<void>;
}

export interface AnalyticsService {
  trackSwipe(data: {
    photoId: string;
    action: PhotoAction;
    direction: string;
    velocity: number;
    timestamp: Date;
  }): Promise<void>;
}