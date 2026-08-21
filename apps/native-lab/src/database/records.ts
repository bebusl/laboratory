import type { SQLiteDatabase } from 'expo-sqlite';

import type { StoredAttachment } from '@/features/attachments/types';

export interface FieldRecord {
  id: string;
  title: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttachmentRecord extends StoredAttachment {
  id: string;
  recordId: string;
  createdAt: string;
}

interface FieldRecordRow {
  id: string;
  title: string;
  memo: string;
  created_at: string;
  updated_at: string;
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON');

  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;
  const databaseVersion = 1;

  if (currentVersion >= databaseVersion) {
    return;
  }

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      memo TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id TEXT PRIMARY KEY NOT NULL,
      record_id TEXT NOT NULL,
      name TEXT NOT NULL,
      kind TEXT NOT NULL,
      mime_type TEXT,
      size INTEGER,
      extension TEXT,
      uri TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (record_id) REFERENCES records(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS attachments_record_id_idx ON attachments(record_id);
  `);

  await db.execAsync(`PRAGMA user_version = ${databaseVersion}`);
}

export async function listRecords(db: SQLiteDatabase) {
  const rows = await db.getAllAsync<FieldRecordRow>(
    'SELECT id, title, memo, created_at, updated_at FROM records ORDER BY updated_at DESC'
  );

  return rows.map(toFieldRecord);
}

export async function insertRecord(db: SQLiteDatabase, record: FieldRecord) {
  await db.runAsync(
    `INSERT INTO records (id, title, memo, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    record.id,
    record.title,
    record.memo,
    record.createdAt,
    record.updatedAt
  );
}

export async function updateRecord(db: SQLiteDatabase, record: FieldRecord) {
  const result = await db.runAsync(
    `UPDATE records
     SET title = ?, memo = ?, updated_at = ?
     WHERE id = ?`,
    record.title,
    record.memo,
    record.updatedAt,
    record.id
  );

  if (result.changes !== 1) {
    throw new Error('Record was not found while updating');
  }
}

export async function removeRecord(db: SQLiteDatabase, id: string) {
  const result = await db.runAsync('DELETE FROM records WHERE id = ?', id);

  if (result.changes !== 1) {
    throw new Error('Record was not found while deleting');
  }
}

export async function insertAttachment(
  db: SQLiteDatabase,
  recordId: string,
  attachment: StoredAttachment
) {
  await db.runAsync(
    `INSERT INTO attachments
      (id, record_id, name, kind, mime_type, size, extension, uri, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    createAttachmentId(),
    recordId,
    attachment.name,
    attachment.kind,
    attachment.mimeType,
    attachment.size,
    attachment.extension,
    attachment.uri,
    new Date().toISOString()
  );
}

export async function listAttachments(db: SQLiteDatabase, recordId: string) {
  const rows = await db.getAllAsync<AttachmentRecordRow>(
    `SELECT id, record_id, name, kind, mime_type, size, extension, uri, created_at
     FROM attachments
     WHERE record_id = ?
     ORDER BY created_at ASC`,
    recordId
  );

  return rows.map(toAttachmentRecord);
}

function toFieldRecord(row: FieldRecordRow): FieldRecord {
  return {
    id: row.id,
    title: row.title,
    memo: row.memo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

interface AttachmentRecordRow {
  id: string;
  record_id: string;
  name: string;
  kind: StoredAttachment['kind'];
  mime_type: string | null;
  size: number | null;
  extension: string | null;
  uri: string;
  created_at: string;
}

function toAttachmentRecord(row: AttachmentRecordRow): AttachmentRecord {
  return {
    createdAt: row.created_at,
    extension: row.extension,
    id: row.id,
    kind: row.kind,
    mimeType: row.mime_type,
    name: row.name,
    recordId: row.record_id,
    size: row.size,
    uri: row.uri,
  };
}

function createAttachmentId() {
  return `attachment-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
