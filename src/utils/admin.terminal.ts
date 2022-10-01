import yargs from 'yargs';
import mongoose from 'mongoose';
import 'dotenv/config';
import { exit } from 'process';
import UserModel from '../models/user.model';
import logger from './logger.util';

const { email, username, password } = yargs(process.argv.slice(3))
  .usage('admin -e <email> -p <password>')
  .options({
    email: { type: 'string', demandOption: true, alias: 'e' },
    username: { type: 'string', demandOption: true, alias: 'u' },
    password: { type: 'string', demandOption: true, alias: 'p' },
  })
  .parseSync();

mongoose.connect(process.env.DB_URI as string, () => {
  UserModel.create({
    role: 'admin',
    username,
    email,
    password,
  })
    .then(() => {
      logger.info('Created admin account successfully');
      exit(0);
    })
    .catch((err) => {
      console.log('Failed to create admin account ' + err);
      exit(1);
    });
});
