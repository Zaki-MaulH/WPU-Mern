import dotenv from "dotenv";

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || (() => {
    throw new Error("DATABASE_URL is not defined in .env file");
  })();
  