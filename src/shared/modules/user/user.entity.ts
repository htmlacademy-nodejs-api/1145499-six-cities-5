import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ minlength: 1, maxlength: 15, required: true })
  public name;

  @prop({ unique: true, required: true })
  public email;

  @prop()
  public avatar;

  @prop()
  public type;

  @prop({ min: 6, max: 12, required: true })
  public _password: string;

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatar = userData.avatar;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this._password = createSHA256(password, salt);
  }

  public getPassword() {
    return this._password;
  }
}

export const UserModel = getModelForClass(UserEntity);
