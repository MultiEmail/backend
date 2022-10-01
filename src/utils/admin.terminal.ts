import yargs from 'yargs';
import mongoose from 'mongoose';
import 'dotenv/config';
import { exit } from 'process';
import { AdminSchema } from '../schemas/admin.schema';
import { hashPassword } from './hashPass.util';

const { email, username, password } = yargs(process.argv.slice(3))
  .usage('admin -e <email> -p <password>')
  .options({
    email: { type: 'string', demandOption: true, alias: 'e' },
    username: { type: 'string', demandOption: true, alias: 'u' },
    password: { type: 'string', demandOption: true, alias: 'p' },
  })
  .parseSync();

let hashPass = hashPassword(password);
mongoose.connect(process.env.DB_URI as string, () => {
  AdminSchema.create({
    email,
    username,
    password: hashPass,
  })
    .then(() => {
      console.log('✔ Admin created successfully');

      exit(0);
    })
    .catch((err) => {
      console.log(err);
      if (err) console.log('❌ Admin user already exists');

      exit(1);
    });
});
