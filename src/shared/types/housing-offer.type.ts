import { Geo } from './geo.type.js';
import { HousingFeature } from './housing-feature.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type HousingOffer = {
  title: string;
  description: string;
  city: string;
  previewPhoto: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  rooms: number;
  guests: number;
  cost: number;
  features: HousingFeature[];
  user: User;
  commentsTotal: number;
  geo: Geo;
};
