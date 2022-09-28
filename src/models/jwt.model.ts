import { prop, getModelForClass } from '@typegoose/typegoose';

class JWTUser {
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: 0 })
  tokenVersion: number;

  @prop({ default: false })
  isAdmin: boolean;
}

export const JwtModel = getModelForClass(JWTUser);
