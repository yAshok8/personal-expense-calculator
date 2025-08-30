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

  async getCategoriesList(): Promise<{ id: number; name: string }[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT id, name FROM categories`);
      return result.values as { id: number; name: string }[] || [];
    });
  }

  async getCategoryTotalsForMonth(year: number, month: number): Promise<{ id: number; name: string; total: number }[]> {
    // Format month as two digits
    const monthStr = month.toString().padStart(2, '0');
    const datePattern = `${year}-${monthStr}-%`; // e.g., 2025-08-%

    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
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
      return result.values || [];
    });
  }

  async truncateCategories(): Promise<void> {
    return this._dbService.executeQuery(async (db) => {
      await db.run(`DELETE FROM categories`);
    });
  }

}
