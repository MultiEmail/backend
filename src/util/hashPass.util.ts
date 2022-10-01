import { hash } from 'bcryptjs';
export const hasPassword = async (pass: string) => {
  return await hash(pass, 14);
};
