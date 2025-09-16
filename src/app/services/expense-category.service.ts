import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Expense} from "../models/expense";

@Injectable({
  providedIn: 'root',
})
export class ExpenseCategoryService {

  constructor(private _dbService: DatabaseService) {
  }

  async getAllCategories(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT * FROM categories ORDER BY id ASC`);
      return result.values || [];
    });
  }

  async addCategory(category: { name: string }): Promise<{ id: number; name: string }> {
    return this._dbService.executeQuery(async (db) => {
      // Run the INSERT query
      await db.query(`INSERT INTO categories (name) VALUES (?)`, [category.name]);
      // Fetch the last inserted row by name (or use a SELECT with ORDER BY id DESC)
      const result = await db.query(
        `SELECT id, name FROM categories WHERE name = ? ORDER BY id DESC LIMIT 1`,
        [category.name]
      );
      const insertedCategory = result.values?.[0];
      if (!insertedCategory) {
        throw new Error('Failed to retrieve inserted category');
      }
      return insertedCategory as { id: number; name: string };
    });
  }



  async getCategoriesList(): Promise<{ id: number; name: string }[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT id, name FROM categories`);
      return result.values as { id: number; name: string }[] || [];
    });
  }

  async getCategoryTotalsForMonth(year: number, month: number): Promise<{ id: number; name: string; total: number }[]> {
    const monthStr = month.toString().padStart(2, '0');
    const datePattern = `${year}-${monthStr}-%`;

    const result = await this._dbService.executeQuery(async (db) => {
      const res = await db.query(
        `
        SELECT c.id, c.name, IFNULL(SUM(e.amount), 0) AS total
        FROM categories c
               LEFT JOIN expense_item e
                         ON e.category_id = c.id AND e.date LIKE ?
        GROUP BY c.id, c.name
        HAVING total > 0
        ORDER BY total DESC
      `,
        [datePattern]
      );
      return res.values || [];
    });

    if (!result || result.length === 0) return [];

    // Take top 4 categories
    const top4 = result.slice(0, 5);

    // Group the rest into "Others"
    if (result.length > 5) {
      const othersTotal = result.slice(5).reduce((sum, r) => sum + r.total, 0);
      top4.push({ id: -1, name: "Others", total: othersTotal });
    }

    return top4;
  }

  async truncateCategories(): Promise<void> {
    return this._dbService.executeQuery(async (db) => {
      await db.run(`DELETE FROM categories`);
    });
  }


}
