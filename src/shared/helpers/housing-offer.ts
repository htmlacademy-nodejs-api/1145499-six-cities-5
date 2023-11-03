import { HousingOffer } from '../types/housing-offer.type.js';
import { HousingType } from '../types/housing-type.enum.js';
import { HousingFeature } from '../types/housing-feature.enum.js';
import { UserType } from '../types/user-type.enum.js';

export const createHousingOffer = (rawData: string): HousingOffer => {
  const [
    title,
    description,
    city,
    previewPhoto,
    photos,
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
    commentsCount,
    latitude,
    longitude,
  ] = rawData.replace('\n', '').split('\t');

  return {
    title,
    description,
    city,
    previewPhoto,
    photos: photos.split(';'),
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
    user: {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      password: userPassword,
      type: UserType[userType as keyof typeof UserType],
    },
    commentsCount: Number.parseInt(commentsCount, 10),
    geo: { latitude, longitude },
  };
};
