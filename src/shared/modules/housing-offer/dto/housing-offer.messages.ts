export const HousingOfferMessages = {
  title: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 10, max is 100',
  },
  description: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 20, max is 1024',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a boolean',
  },
  previewPhoto: {
    invalidFormat: 'previewPhoto must be a string',
  },
  photos: {
    invalidFormat: 'photos must be an array of string',
  },
  type: { invalid: 'type must be "apartment" or "house" or "room" or "hotel"' },
  rooms: {
    invalidFormat: 'rooms must be an integer',
    min: 'minimum rooms is 1',
    max: 'maximum rooms is 8',
  },
  guests: {
    invalidFormat: 'guests must be an integer',
    min: 'minimum guests is 1',
    max: 'maximum guests is 10',
  },
  cost: {
    invalidFormat: 'cost must be an integer',
    min: 'minimum cost is 100',
    max: 'maximum cost is 100 000',
  },
  features: {
    invalidFormat: 'features must be an array of string',
  },
  userId: {
    invalidFormat: 'userId field must be a valid id',
  },
} as const;
