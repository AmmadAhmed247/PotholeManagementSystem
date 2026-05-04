import oracledb from 'oracledb';
import dotenv from 'dotenv';
import { initSchema } from '../models/Schema.js';
dotenv.config();

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [ oracledb.CLOB ];

export const connectDb = async () => {
  try {
    await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });
    console.log('Oracle connection pool created');
    await initSchema();
  } catch (error) {
    console.error('Failed to connect to Oracle:', error.message);
    process.exit(1);
  }
};

export const closeDb = async () => {
  await oracledb.getPool().close(10);
};

export const withConnection = async (fn) => {
  const conn = await oracledb.getConnection();
  try {
    return await fn(conn);
  } finally {
    await conn.close();
  }
};