import { HousingOffer } from '../../types/housing-offer.type.js';

export interface IFileReader {
  read(): void;
  toArray(): HousingOffer[];
}
