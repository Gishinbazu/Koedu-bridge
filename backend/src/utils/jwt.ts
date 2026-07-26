// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface JwtPayload {
  sub: string;
  role: string;
}

export const signToken = (userId: string, role: string) => {
  return jwt.sign({ sub: userId, role }, config.JWT_SECRET, {
    expiresIn: "1h"
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.JWT_SECRET) as JwtPayload;
};
