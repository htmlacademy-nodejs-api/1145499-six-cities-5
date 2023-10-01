import { Geo } from './geo.type.js';
import { HousingFeature } from './housing-feature.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type HousingOffer = {
  title: string;
  description: string;
  createdDate: Date;
  city: string;
  previewImage: string;
  generalImage: string;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  rooms: number;
  guests: number;
  cost: number;
  features: HousingFeature[];
  author: User;
  commentsTotal: number;
  geo: Geo;
};
