import { connect } from 'mongoose';

export default async function connectDB(uri: string) {
  connect(uri)
    .then(() => {
      console.log('Connected to database...');
    })
    .catch((err) => console.error(err));
}
