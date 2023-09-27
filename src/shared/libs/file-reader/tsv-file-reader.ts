import { IFileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { HousingOffer } from '../../types/housing-offer.type.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { HousingFeature } from '../../types/housing-feature.enum.js';
import { UserType } from '../../types/user-type.enum.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): HousingOffer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(
        ([
          title,
          description,
          createdDate,
          city,
          previewImg,
          generalImg,
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          cost,
          features,
          userName,
          userEmail,
          userAvatar,
          userPassword,
          userType,
          commentsTotal,
          latitude,
          longitude,
        ]) => ({
          title,
          description,
          createdDate: new Date(createdDate),
          city,
          previewImg,
          generalImg,
          isPremium: isPremium === 'true',
          isFavorite: isFavorite === 'true',
          rating: Number.parseInt(rating, 10),
          type: HousingType[type as keyof typeof HousingType],
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          cost: Number.parseInt(cost, 10),
          features: features
            .split(';')
            .map((feature) => HousingFeature[feature as keyof typeof HousingFeature]),
          author: {
            name: userName,
            email: userEmail,
            avatar: userAvatar,
            password: userPassword,
            type: UserType[userType as keyof typeof UserType],
          },
          commentsTotal: Number.parseInt(commentsTotal, 10),
          geo: { latitude, longitude },
        }),
      );
  }
}
