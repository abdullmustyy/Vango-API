import bcryptjs from "bcryptjs";

export const comparePassword = async (password: string, hash: string) =>
  await bcryptjs.compare(password, hash);

export const hashPassword = async (password: string) =>
  await bcryptjs.hash(password, 12);
