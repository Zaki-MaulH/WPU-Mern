import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || (() => {
    throw new Error("DATABASE_URL is not defined in .env file");
  })();

export const SECRET: string = process.env.SECRET || (() => {
    throw new Error("SECRET is not defined in .env file");
  })();

export const EMAIL_SMTP_SECURE: boolean = Boolean(process.env.EMAIL_SMTP_SECURE) || false;

export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || (() => {
    throw new Error("EMAIL_SMTP_PASS is not defined in .env file");
  })();

export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || (() => {
    throw new Error("EMAIL_SMTP_USER is not defined in .env file");
  })();

export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || (() => {
    throw new Error("EMAIL_SMTP_HOST is not defined in .env file");
  })();

export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465;

export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME || (() => {
    throw new Error("EMAIL_SMTP_SERVICE is not defined in .env file");
  })();

export const CLIENT_HOST: string = process.env.CLIENT_HOST || "http://localhost:3001";
  