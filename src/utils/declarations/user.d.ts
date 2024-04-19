import { IUser } from "../interfaces/user.interface";

declare namespace Express {
  interface User extends IUser {}
}
