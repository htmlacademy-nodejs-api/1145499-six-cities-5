import dayjs from 'dayjs';
import { IOfferGenerator } from './offer-generator.interface.js';
import { MockServerData, UserType } from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  CitiesMap,
} from '../../helpers/index.js';

const MIN_COST = 100;
const MAX_COST = 100000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_COMMENTS = 1;
const MAX_COMMENTS = 5;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const generalImage = getRandomItem(this.mockData.generalImages);
    const isPremium = getRandomItem(['true', 'false']);
    const isFavorite = getRandomItem(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING).toString();
    const type = getRandomItem(this.mockData.housingTypes);
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const cost = generateRandomValue(MIN_COST, MAX_COST).toString();
    const features = getRandomItems(this.mockData.housingFeatures).join(';');
    const userName = getRandomItem(this.mockData.userNames);
    const userEmail = getRandomItem(this.mockData.emails);
    const userAvatar = getRandomItem(this.mockData.avatars);
    const userPassword = '********';
    const userType = getRandomItem(Object.keys(UserType));
    const commentsTotal = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const latitude = CitiesMap[city as keyof typeof CitiesMap]?.latitude;
    const longitude = CitiesMap[city as keyof typeof CitiesMap]?.longitude;

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      createdDate,
      city,
      previewImage,
      generalImage,
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
    ].join('\t');
  }
}
