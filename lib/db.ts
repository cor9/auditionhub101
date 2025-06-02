import { createDbWorker } from "sql.js-httpvfs";
import type { AuditionData, ExpenseData, ContactData } from '@/types';

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);

const wasmUrl = new URL(
  "sql.js-httpvfs/dist/sql-wasm.wasm",
  import.meta.url
);

async function createDb() {
  const worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "/auditionhub.db",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  return worker;
}

let dbWorker: Awaited<ReturnType<typeof createDb>>;

export async function getDb() {
  if (!dbWorker) {
    dbWorker = await createDb();
  }
  return dbWorker;
}

export async function createAudition(audition: AuditionData) {
  const db = await getDb();
  await db.db.exec(`
    INSERT INTO auditions (
      id, projectTitle, roleName, type, status, description, auditionDate,
      callbackDate, location, virtualLink, notes, sides, selftapeUrl,
      castingCompany, castingDirector, castingAssistant, castingEmail,
      castingPhone, submittedBy, submittedDate, createdAt, updatedAt
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `, [
    audition.id,
    audition.projectTitle,
    audition.roleName,
    audition.type,
    audition.status,
    audition.description || null,
    audition.auditionDate?.toISOString() || null,
    audition.callbackDate?.toISOString() || null,
    audition.location || null,
    audition.virtualLink || null,
    audition.notes || null,
    audition.sides || null,
    audition.selftapeUrl || null,
    audition.castingCompany || null,
    audition.castingDirector || null,
    audition.castingAssistant || null,
    audition.castingEmail || null,
    audition.castingPhone || null,
    audition.submittedBy || null,
    audition.submittedDate?.toISOString() || null,
    audition.createdAt.toISOString(),
    audition.updatedAt.toISOString()
  ]);
}

export async function getAuditions() {
  const db = await getDb();
  const result = await db.db.exec("SELECT * FROM auditions ORDER BY auditionDate DESC");
  return result[0].values.map((row) => ({
    id: row[0],
    projectTitle: row[1],
    roleName: row[2],
    type: row[3],
    status: row[4],
    description: row[5],
    auditionDate: row[6] ? new Date(row[6]) : null,
    callbackDate: row[7] ? new Date(row[7]) : null,
    location: row[8],
    virtualLink: row[9],
    notes: row[10],
    sides: row[11],
    selftapeUrl: row[12],
    castingCompany: row[13],
    castingDirector: row[14],
    castingAssistant: row[15],
    castingEmail: row[16],
    castingPhone: row[17],
    submittedBy: row[18],
    submittedDate: row[19] ? new Date(row[19]) : null,
    createdAt: new Date(row[20]),
    updatedAt: new Date(row[21])
  }));
}

// Similar implementations for expenses and contacts...

export async function initializeDb() {
  const db = await getDb();
  await db.db.exec(`
    CREATE TABLE IF NOT EXISTS auditions (
      id TEXT PRIMARY KEY,
      projectTitle TEXT NOT NULL,
      roleName TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      auditionDate TEXT,
      callbackDate TEXT,
      location TEXT,
      virtualLink TEXT,
      notes TEXT,
      sides TEXT,
      selftapeUrl TEXT,
      castingCompany TEXT,
      castingDirector TEXT,
      castingAssistant TEXT,
      castingEmail TEXT,
      castingPhone TEXT,
      submittedBy TEXT,
      submittedDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      receiptUrl TEXT,
      reimbursable INTEGER NOT NULL,
      reimbursed INTEGER NOT NULL,
      auditionId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY(auditionId) REFERENCES auditions(id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      website TEXT,
      instagram TEXT,
      notes TEXT,
      lastContacted TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}