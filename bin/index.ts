#!/usr/bin/env node
import yargs from 'yargs';
import mongoose from 'mongoose';
import 'dotenv/config';
import { exit } from 'process';
import UserModel from '../src/models/user.model';

const { email, username, password } = yargs(process.argv.slice(3))
  .usage('admin -e <email> -u <username> -p <password>')
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
    verified: true,
    password,
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
