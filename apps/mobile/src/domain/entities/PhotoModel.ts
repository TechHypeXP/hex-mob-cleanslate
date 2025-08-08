/**
 * PhotoModel - Domain Entity
 * Core representation of user photos with business logic
 */
import { PhotoItem } from '@shared/types/PhotoItem';

export class PhotoModel implements PhotoItem {
  constructor(
    public id: string,
    public uri: string,
    public filename: string,
    public width: number,
    public height: number,
    public fileSize: number,
    public mimeType: string,
    public creationTime: number,
    public modificationTime: number,
    public albumId?: string,
    public location?: PhotoItem['location'],
    public exif?: PhotoItem['exif']
  ) {}
}