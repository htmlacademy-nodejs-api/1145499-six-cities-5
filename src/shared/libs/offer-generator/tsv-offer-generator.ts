import { IOfferGenerator } from './offer-generator.interface.js';
import { MockServerData, UserType } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { CitiesMap } from '../../constants/index.js';

const MIN_COST = 100;
const MAX_COST = 100000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewPhoto = getRandomItem(this.mockData.previewPhotos);
    const photos = getRandomItems(this.mockData.photos).join(';');
    const isPremium = getRandomItem(['true', 'false']);
    const isFavorite = false;
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const type = getRandomItem(this.mockData.housingTypes);
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const cost = generateRandomValue(MIN_COST, MAX_COST).toString();
    const features = getRandomItems(this.mockData.housingFeatures).join(';');
    const userName = getRandomItem(this.mockData.userNames);
    const userEmail = getRandomItem(this.mockData.emails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userPassword = 'Passw0rd!23';
    const userType = getRandomItem(Object.keys(UserType));
    const commentsCount = 0;
    const latitude = CitiesMap[city as keyof typeof CitiesMap]?.latitude;
    const longitude = CitiesMap[city as keyof typeof CitiesMap]?.longitude;

    return [
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
    ].join('\t');
  }
}
