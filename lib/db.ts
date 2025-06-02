import Database from 'better-sqlite3';
import { AuditionData, ExpenseData, ContactData } from '@/types';

const db = new Database('auditionhub.db');

// Initialize database with tables
db.exec(`
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

// Prepare statements for better performance
const insertAudition = db.prepare(`
  INSERT INTO auditions (
    id, projectTitle, roleName, type, status, description, auditionDate,
    callbackDate, location, virtualLink, notes, sides, selftapeUrl,
    castingCompany, castingDirector, castingAssistant, castingEmail,
    castingPhone, submittedBy, submittedDate, createdAt, updatedAt
  ) VALUES (
    @id, @projectTitle, @roleName, @type, @status, @description, @auditionDate,
    @callbackDate, @location, @virtualLink, @notes, @sides, @selftapeUrl,
    @castingCompany, @castingDirector, @castingAssistant, @castingEmail,
    @castingPhone, @submittedBy, @submittedDate, @createdAt, @updatedAt
  )
`);

const insertExpense = db.prepare(`
  INSERT INTO expenses (
    id, amount, description, category, date, receiptUrl, reimbursable,
    reimbursed, auditionId, createdAt, updatedAt
  ) VALUES (
    @id, @amount, @description, @category, @date, @receiptUrl, @reimbursable,
    @reimbursed, @auditionId, @createdAt, @updatedAt
  )
`);

const insertContact = db.prepare(`
  INSERT INTO contacts (
    id, name, type, company, email, phone, website, instagram,
    notes, lastContacted, createdAt, updatedAt
  ) VALUES (
    @id, @name, @type, @company, @email, @phone, @website, @instagram,
    @notes, @lastContacted, @createdAt, @updatedAt
  )
`);

export function createAudition(audition: AuditionData) {
  return insertAudition.run(audition);
}

export function createExpense(expense: ExpenseData) {
  return insertExpense.run(expense);
}

export function createContact(contact: ContactData) {
  return insertContact.run(contact);
}

export function getAuditions() {
  return db.prepare('SELECT * FROM auditions ORDER BY auditionDate DESC').all();
}

export function getExpenses() {
  return db.prepare('SELECT * FROM expenses ORDER BY date DESC').all();
}

export function getContacts() {
  return db.prepare('SELECT * FROM contacts ORDER BY name ASC').all();
}

export default db;