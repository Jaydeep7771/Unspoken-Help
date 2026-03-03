import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { Role } from "@prisma/client";
import { env } from "@/lib/env";

export type AuthPayload = { userId: string; role: Role };

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);

export const signToken = (payload: AuthPayload) => jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });

export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AuthPayload;

export const setAuthCookie = (token: string) => {
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
};

export const getAuthFromRequest = (req: NextRequest) => {
  const token = req.cookies.get("auth_token")?.value;
  return token ? verifyToken(token) : null;
};
