export const CreateCommentMessages = {
  text: {
    invalidFormat: 'text is required',
    lengthField: 'min length is 5, max is 1024',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    min: 'minimum rating is 1',
    max: 'maximum rating is 5',
  },
} as const;
