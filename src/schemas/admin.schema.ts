import { prop, getModelForClass } from '@typegoose/typegoose';

class AdminModel {
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  username: string;

  @prop({ required: true })
  password: string;
}
export const AdminSchema = getModelForClass(AdminModel);
