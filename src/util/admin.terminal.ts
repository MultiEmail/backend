#!/usr/bin/env node

import yargs from 'yargs';
import 'dotenv/config';
import mongoose from 'mongoose';
import { exit } from 'process';
import { AdminModel } from '../schemas/admin.schema';
import logger from './logger.util';
import { hasPassword } from './hashPass.util';

const { email, username, password } = yargs(process.argv.slice(3))
  .usage('admin -e <email> -p <password>')
  .options({
    email: { type: 'string', demandOption: true, alias: 'e' },
    username: { type: 'string', demandOption: true, alias: 'u' },
    password: { type: 'string', demandOption: true, alias: 'p' },
  })
  .parseSync();

let hashedPass = hasPassword(password);
mongoose.connect(process.env.DB_URI as string, () => {
  AdminModel.create({
    email,
    username,
    password: hashedPass,
  })
    .then(() => {
      logger.info('✔ Admin created successfully');

      exit(0);
    })
    .catch((err) => {
      logger.error(err);
      if (err) console.log('❌ Admin user already exists');

      exit(1);
    });
});
