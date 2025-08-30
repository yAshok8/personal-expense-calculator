import {Injectable} from '@angular/core';
import {DatabaseService} from './database.service';
import {SQLiteService} from './sqlite.service';


// export const createSchemaExpenseDays: string = `
// CREATE TABLE IF NOT EXISTS expense_day (
//     date TEXT PRIMARY KEY,
//     total_amount REAL
//   );
// `;

export const createSchemaExpenseItem: string = `
  CREATE TABLE IF NOT EXISTS expense_item (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     date TEXT,
     item_name TEXT,
     amount REAL,
     category TEXT
  );
`;

export const createSchemaExpenseCategory: string = `
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`;

@Injectable()
export class MigrationService {

  constructor(private sqliteService: SQLiteService, private databaseService: DatabaseService) {
  }

  async migrate(): Promise<any> {
    // await this.createExpenseDaysTable();
    await this.createExpenseItem();
    await this.createExpenseCatagory();
    await this.insertDefaultCategories();
  }

  // async createExpenseDaysTable(): Promise<any> {
  //   await this.databaseService.executeQuery(async (db) => {
  //     await db.execute(createSchemaExpenseDays);
  //   });
  // }

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

  async insertDefaultCategories(): Promise<any> {
    const categories = ["Food", "Transport", "Bills", "Leisure"];
    const insertCategorySql = `INSERT OR IGNORE INTO categories (name) VALUES (?);`;

    return await this.databaseService.executeQuery(async (db) => {
      try {
        for (const category of categories) {
          await db.run(insertCategorySql, [category]);
        }
        console.log("Default categories inserted successfully.");
      } catch (err) {
        console.error("Error inserting default categories:", err);
        throw err;
      }
    });
  }

 }
