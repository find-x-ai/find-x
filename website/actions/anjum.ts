"use server";
import { Anjum } from "anjum";
import { PostgresNeon } from "anjum/plugins";
        
const anjum = new Anjum({
  database: PostgresNeon(),
  name: "Anjum",
});
        
export const {
  register,
  login,
  getSession,
  logout,
  sendEmailVerificationCode,
  verifyEmailVerificationCode,
  deleteAccount,
  resetPassword
} = anjum;