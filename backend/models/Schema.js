import { withConnection } from '../services/Db.js';

const createIfNotExists = async (conn, sql) => {
  try {
    await conn.execute(sql);
  } catch (err) {
    if (err.errorNum !== 955) throw err;
  }
};

export const initSchema = async () => {
  const conn = await withConnection(async (conn) => {
    await createIfNotExists(conn, `
      CREATE TABLE users (
        id       RAW(16)       DEFAULT SYS_GUID() PRIMARY KEY,
        name     VARCHAR2(200) NOT NULL,
        cnic     VARCHAR2(20)  NOT NULL,
        mobile   VARCHAR2(20)  NOT NULL,
        email    VARCHAR2(200) NOT NULL UNIQUE,
        password VARCHAR2(200) NOT NULL,
        role     VARCHAR2(10)  DEFAULT 'user'
                               CHECK (role IN ('admin', 'manager', 'user'))
      )
    `);

 await createIfNotExists(conn, `
  CREATE TABLE complaints (
    id          RAW(16)       DEFAULT SYS_GUID() PRIMARY KEY,
    user_id     RAW(16)       NOT NULL REFERENCES users(id),
    title       VARCHAR2(500) NOT NULL,
    description CLOB          NOT NULL,
    location    VARCHAR2(500) NOT NULL,
    area        VARCHAR2(200),
    image       CLOB,        
    status      VARCHAR2(20)  DEFAULT 'Pending'
                              CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
  )
`);

    await conn.execute(`
      CREATE OR REPLACE TRIGGER complaints_updated_at
      BEFORE UPDATE ON complaints
      FOR EACH ROW
      BEGIN
        :NEW.updated_at := CURRENT_TIMESTAMP;
      END;
    `);

    await conn.commit();
    console.log('Schema ready');
  });
};