// lib/offlineQueue.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('kyc.db');

export const initQueue = () =>
  db.execSync(`
    CREATE TABLE IF NOT EXISTS pending_kyc (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      method     TEXT,
      payload    TEXT,
      photo_uri  TEXT,
      created_at INTEGER
    );
  `);

export const addToQueue = (
  method: string,
  payload: object,
  photoUri: string
) =>
  db.runSync(
    `INSERT INTO pending_kyc (method, payload, photo_uri, created_at)
     VALUES (?, ?, ?, ?)`,
    [method, JSON.stringify(payload), photoUri, Date.now()]
  );

export const getQueue = () =>
  db.getAllSync(`SELECT * FROM pending_kyc ORDER BY created_at ASC`);

export const removeFromQueue = (id: number) =>
  db.runSync(`DELETE FROM pending_kyc WHERE id = ?`, [id]);