export const CreateUserMessages = {
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  email: {
    invalidFormat: 'email must be a valid address',
  },
  avatar: {
    invalidFormat: 'avatar is required',
  },
  _password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12',
  },

  type: { invalid: 'type must be pro and standart' },
} as const;
