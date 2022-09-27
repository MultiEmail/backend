import { model, Schema } from 'mongoose';
import { UserDocumentType } from '../../types/User.types';

const user = new Schema<UserDocumentType>({
  email: {},
  username: {},
  googleId: {},
});

const Userdata = model('Users', user);

export default Userdata;
