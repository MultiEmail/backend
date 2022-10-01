import { hash } from 'bcrypt';

export const hashPassword = async (password: string) => {
  return await hash(password, 14);
};
