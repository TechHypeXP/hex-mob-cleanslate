/**
 * PhotoModel - Domain Entity
 * Core representation of user photos with business logic
 */
export interface PhotoItem {
  id: string;
  uri: string;
  createdAt: Date;
  isFavorite: boolean;
  tags: string[];
  metadata?: {
    width: number;
    height: number;
    size: number;
  };
}

export class PhotoModel implements PhotoItem {
  constructor(
    public id: string,
    public uri: string,
    public createdAt: Date = new Date(),
    public isFavorite: boolean = false,
    public tags: string[] = [],
    public metadata?: { width: number; height: number; size: number }
  ) {}

  // Domain methods
  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }
}