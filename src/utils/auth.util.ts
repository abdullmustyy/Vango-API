import bcryptjs from "bcryptjs";

export const comparePassword = (password: string, hash: string) =>
  bcryptjs.compareSync(password, hash);

export const hashPassword = (password: string) =>
  bcryptjs.hashSync(password, 12);
