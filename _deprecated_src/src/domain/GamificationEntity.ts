/**
 * GamificationEntity.ts - Domain entity for gamification features
 * 
 * Manages user progress, achievements, and gamification mechanics.
 * Implements business rules for scoring, leveling, and rewards.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

export interface UserStats {
  totalPhotosProcessed: number;
  photosDeleted: number;
  photosKept: number;
  photosShared: number;
  photosPrivate: number;
  sessionsCompleted: number;
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastSessionDate?: Date;
}

export enum GamificationEvent {
  PHOTO_PROCESSED = 'photo_processed',
  SESSION_COMPLETED = 'session_completed',
  STREAK_MAINTAINED = 'streak_maintained',
  MILESTONE_REACHED = 'milestone_reached',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked'
}

/**
 * GamificationEntity - Core gamification logic and state management
 * Handles scoring, achievements, and user progression
 */
export class GamificationEntity {
  private static readonly POINTS_PER_PHOTO = 10;
  private static readonly STREAK_BONUS_MULTIPLIER = 1.5;
  private static readonly SESSION_COMPLETION_BONUS = 50;

  constructor(
    public readonly userId: string,
    public stats: UserStats,
    public achievements: Achievement[],
    public currentLevel: number = 1,
    public currentXP: number = 0,
    public totalPoints: number = 0
  ) {
    this.validateEntity();
  }

  /**
   * Validates gamification entity data
   * @throws Error if data is invalid
   */
  private validateEntity(): void {
    if (!this.userId || this.userId.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

    if (this.currentLevel < 1) {
      throw new Error('Level must be at least 1');
    }

    if (this.currentXP < 0 || this.totalPoints < 0) {
      throw new Error('XP and points cannot be negative');
    }
  }

  /**
   * Processes a gamification event and updates state
   * @param event - The gamification event that occurred
   * @param metadata - Additional event data
   * @returns Updated GamificationEntity
   */
  public processEvent(event: GamificationEvent, metadata?: any): GamificationEntity {
    let updatedStats = { ...this.stats };
    let pointsEarned = 0;
    let xpEarned = 0;

    switch (event) {
      case GamificationEvent.PHOTO_PROCESSED:
        updatedStats = this.updatePhotoStats(updatedStats, metadata.action);
        pointsEarned = this.calculatePhotoPoints();
        xpEarned = pointsEarned;
        break;

      case GamificationEvent.SESSION_COMPLETED:
        updatedStats.sessionsCompleted += 1;
        updatedStats.lastSessionDate = new Date();
        pointsEarned = GamificationEntity.SESSION_COMPLETION_BONUS;
        xpEarned = pointsEarned;
        break;

      case GamificationEvent.STREAK_MAINTAINED:
        updatedStats.streakDays = metadata.streakDays;
        pointsEarned = Math.floor(metadata.streakDays * 10 * GamificationEntity.STREAK_BONUS_MULTIPLIER);
        xpEarned = pointsEarned;
        break;
    }

    const newTotalPoints = this.totalPoints + pointsEarned;
    const newXP = this.currentXP + xpEarned;
    const newLevel = this.calculateLevel(newXP);

    // Check for new achievements
    const updatedAchievements = this.checkAchievements(updatedStats);

    return new GamificationEntity(
      this.userId,
      updatedStats,
      updatedAchievements,
      newLevel,
      newXP,
      newTotalPoints
    );
  }

  /**
   * Updates photo-related statistics
   * @param stats - Current stats
   * @param action - Photo action performed
   * @returns Updated stats
   */
  private updatePhotoStats(stats: UserStats, action: string): UserStats {
    const updated = { ...stats };
    updated.totalPhotosProcessed += 1;

    switch (action) {
      case 'delete':
        updated.photosDeleted += 1;
        break;
      case 'keep':
        updated.photosKept += 1;
        break;
      case 'share':
        updated.photosShared += 1;
        break;
      case 'private':
        updated.photosPrivate += 1;
        break;
    }

    return updated;
  }

  /**
   * Calculates points earned for processing a photo
   * @returns Points earned
   */
  private calculatePhotoPoints(): number {
    let basePoints = GamificationEntity.POINTS_PER_PHOTO;
    
    // Apply streak bonus
    if (this.stats.streakDays > 0) {
      basePoints = Math.floor(basePoints * GamificationEntity.STREAK_BONUS_MULTIPLIER);
    }

    return basePoints;
  }

  /**
   * Calculates user level based on XP
   * @param xp - Total experience points
   * @returns User level
   */
  private calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Calculates XP required for next level
   * @returns XP needed for next level
   */
  public getXPForNextLevel(): number {
    const nextLevel = this.currentLevel + 1;
    const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100;
    return xpForNextLevel - this.currentXP;
  }

  /**
   * Gets progress percentage to next level
   * @returns Progress percentage (0-100)
   */
  public getLevelProgress(): number {
    const currentLevelXP = Math.pow(this.currentLevel - 1, 2) * 100;
    const nextLevelXP = Math.pow(this.currentLevel, 2) * 100;
    const progressXP = this.currentXP - currentLevelXP;
    const levelRange = nextLevelXP - currentLevelXP;
    
    return Math.min(100, Math.max(0, (progressXP / levelRange) * 100));
  }

  /**
   * Checks for newly unlocked achievements
   * @param stats - Updated user stats
   * @returns Updated achievements array
   */
  private checkAchievements(stats: UserStats): Achievement[] {
    const achievements = [...this.achievements];
    const now = new Date();

    // Define achievement conditions
    const achievementChecks = [
      {
        id: 'first_photo',
        condition: stats.totalPhotosProcessed >= 1,
        name: 'First Steps',
        description: 'Process your first photo',
        icon: '🎯'
      },
      {
        id: 'photo_master_100',
        condition: stats.totalPhotosProcessed >= 100,
        name: 'Photo Master',
        description: 'Process 100 photos',
        icon: '📸'
      },
      {
        id: 'declutter_champion',
        condition: stats.photosDeleted >= 50,
        name: 'Declutter Champion',
        description: 'Delete 50 photos',
        icon: '🗑️'
      },
      {
        id: 'sharing_enthusiast',
        condition: stats.photosShared >= 25,
        name: 'Sharing Enthusiast',
        description: 'Share 25 photos',
        icon: '📤'
      },
      {
        id: 'privacy_guardian',
        condition: stats.photosPrivate >= 10,
        name: 'Privacy Guardian',
        description: 'Make 10 photos private',
        icon: '🔒'
      },
      {
        id: 'streak_warrior',
        condition: stats.streakDays >= 7,
        name: 'Streak Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥'
      }
    ];

    // Check each achievement
    achievementChecks.forEach(check => {
      const existingAchievement = achievements.find(a => a.id === check.id);
      
      if (check.condition && (!existingAchievement || !existingAchievement.unlockedAt)) {
        const achievementIndex = achievements.findIndex(a => a.id === check.id);
        
        if (achievementIndex >= 0) {
          achievements[achievementIndex] = {
            ...achievements[achievementIndex],
            unlockedAt: now,
            progress: achievements[achievementIndex].maxProgress
          };
        } else {
          achievements.push({
            id: check.id,
            name: check.name,
            description: check.description,
            icon: check.icon,
            unlockedAt: now,
            progress: 1,
            maxProgress: 1
          });
        }
      }
    });

    return achievements;
  }

  /**
   * Gets user's efficiency rating based on actions
   * @returns Efficiency percentage (0-100)
   */
  public getEfficiencyRating(): number {
    const total = this.stats.totalPhotosProcessed;
    if (total === 0) return 0;

    // Efficiency based on decisive actions (delete/keep vs share/private)
    const decisiveActions = this.stats.photosDeleted + this.stats.photosKept;
    return Math.round((decisiveActions / total) * 100);
  }

  /**
   * Gets user's favorite action based on statistics
   * @returns Most frequently used action
   */
  public getFavoriteAction(): string {
    const actions = {
      delete: this.stats.photosDeleted,
      keep: this.stats.photosKept,
      share: this.stats.photosShared,
      private: this.stats.photosPrivate
    };

    return Object.entries(actions).reduce((a, b) => 
      actions[a[0]] > actions[b[0]] ? a : b
    )[0];
  }
}