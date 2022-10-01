import { getModelForClass, prop } from '@typegoose/typegoose';

class AdminSchema {
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  username: string;

  @prop({ required: true })
  password: string;
}

export const AdminModel = getModelForClass(AdminSchema);
