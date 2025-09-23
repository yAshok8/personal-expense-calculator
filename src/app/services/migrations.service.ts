import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {SQLiteService} from './sqlite.service';

export const createSchemaExpenseCategory: string = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );
`;

export const createNotesTable: string = `
      CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
`;


export const createSchemaExpenseBeneficiary: string = `
  CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    name TEXT UNIQUE NOT NULL
  );
`;

export const createSchemaExpenseItem: string = `
  CREATE TABLE IF NOT EXISTS expense_item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    item_name TEXT,
    amount REAL,
    category_id INTEGER NOT NULL,
    beneficiary_id INTEGER NOT NULL,
    spent INTEGER NOT NULL DEFAULT 1,
    created_date TEXT,
    updated_date TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

  CREATE TRIGGER IF NOT EXISTS set_created_date_expense_item
  AFTER INSERT ON expense_item
  BEGIN
  UPDATE expense_item
  SET created_date = datetime('now'),
      updated_date = datetime('now')
  WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS set_updated_date_expense_item
  AFTER UPDATE ON expense_item
  BEGIN
  UPDATE expense_item
  SET updated_date = datetime('now')
  WHERE id = NEW.id;
  END;
`;

@Injectable()
export class MigrationService {

  constructor(private sqliteService: SQLiteService, private databaseService: DatabaseService) {
  }

  async migrate(): Promise<any> {
    await this.createExpenseCatagory();
    await this.createExpenseBeneficiary();
    // await this.insertDefaultBeneficiaries();
    await this.createExpenseItem();
    await this.createNotesTable();
  }

  async createExpenseItem(): Promise<any> {
    await this.databaseService.executeQuery(async (db) => {
      await db.execute(createSchemaExpenseItem);
    });
  }

  async createExpenseCatagory(): Promise<any> {
    await this.databaseService.executeQuery(async (db) => {
      await db.execute(createSchemaExpenseCategory);
    });
  }

  async createExpenseBeneficiary(): Promise<any> {
    await this.databaseService.executeQuery(async (db) => {
      await db.execute(createSchemaExpenseBeneficiary);
    });
  }

  async createNotesTable(): Promise<any> {
    await this.databaseService.executeQuery(async (db) => {
      await db.execute(createNotesTable);
    });
  }

  async insertDefaultBeneficiaries(): Promise<any> {
    const beneficiaries = ["Ashok", "Babita", "Vedant", "Family", "Saudi Home"];
    const insertBeneficiarySql = `INSERT
    OR IGNORE INTO beneficiaries (name) VALUES (?);`;

    return await this.databaseService.executeQuery(async (db) => {
      try {
        for (const beneficiary of beneficiaries) {
          await db.run(insertBeneficiarySql, [beneficiary]);
        }
      } catch (err) {
        console.error("Error inserting default beneficiaries:", err);
        throw err;
      }
    });
  }
}
