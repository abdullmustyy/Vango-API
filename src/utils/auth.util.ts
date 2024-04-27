import fs from "fs";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

import { Algorithm } from "jsonwebtoken";

const PRIV_KEY = fs.readFileSync("./priv.pem", "utf8");

const { JWT_ALGORITHM, JWT_EXPIRATION } = process.env as {
  JWT_ALGORITHM: Algorithm;
  JWT_EXPIRATION: string;
};

export const comparePassword = (password: string, hash: string) =>
  bcryptjs.compareSync(password, hash);

export const hashPassword = (password: string) =>
  bcryptjs.hashSync(password, 12);

export const generateOtp = () =>
  randomstring.generate({ length: 6, charset: "numeric" });

export const issueJwt = (user: {
  email: string;
  username: string;
  userId: string;
}) => {
  const { userId, username, email } = user;

  const payload = {
    sub: userId,
    username,
    email,
    iat: Date.now(),
  };

  const token = jwt.sign(payload, PRIV_KEY, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM,
  });

  return { accessToken: token, exp: JWT_EXPIRATION };
};
