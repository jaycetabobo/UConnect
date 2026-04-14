import mysql from "mysql2/promise";
import { requireEnv, requireEnvAllowEmpty, requireEnvNumber } from "./env";

const DB_HOST = requireEnv("DB_HOST");
const DB_PORT = requireEnvNumber("DB_PORT");
const DB_USER = requireEnv("DB_USER");
const DB_PASSWORD = requireEnvAllowEmpty("DB_PASSWORD");
const DB_NAME = requireEnv("DB_NAME");

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

export const dbConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};

export default pool;
