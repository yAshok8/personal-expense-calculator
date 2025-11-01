import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";
import {SQLiteDBConnection} from "@capacitor-community/sqlite";
import {Expense} from "../models/expense";

@Injectable({
  providedIn: 'root',
})
export class ExpenseDbService {

  constructor(private _dbService: DatabaseService) {
  }

  async getDateRange(): Promise<{ minDate: string, maxDate: string }> {
    return this._dbService.executeQuery(async (db) => {
      const query = `
      SELECT MIN(date) as minDate, MAX(date) as maxDate
      FROM expense_item
    `;
      const result = await db.query(query);

      if (result.values && result.values.length > 0) {
        return {
          minDate: result.values[0].minDate,
          maxDate: result.values[0].maxDate
        };
      }

      // If no data, fallback to current date
      const now = new Date().toISOString().slice(0, 10);
      return { minDate: now, maxDate: now };
    });
  }


  async getTotalSpent(year: string, month: string): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const query = `
      SELECT IFNULL(SUM(amount), 0) as total
      FROM expense_item
      WHERE spent = 1
        AND strftime('%Y', date) = ?
        AND strftime('%m', date) = ?
    `;
      const result = await db.query(query, [year, month]);
      return result.values?.[0]?.total || 0;
    });
  }

  async getTotalReceived(year: string, month: string): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const query = `
      SELECT IFNULL(SUM(amount), 0) as total
      FROM expense_item
      WHERE spent = 0
        AND strftime('%Y', date) = ?
        AND strftime('%m', date) = ?
    `;
      const result = await db.query(query, [year, month]);
      return result.values?.[0]?.total || 0;
    });
  }

  async getCategoriesByExpenseDesc(year: string, month: string): Promise<{ name: string, total: number }[]> {
    return this._dbService.executeQuery(async (db) => {
      const query = `
      SELECT c.name AS name, SUM(e.amount) AS total
      FROM expense_item e
             JOIN categories c ON e.category_id = c.id
      WHERE e.spent = 1
        AND strftime('%Y', e.date) = ?
        AND strftime('%m', e.date) = ?
      GROUP BY c.name
      ORDER BY total DESC
    `;
      const result = await db.query(query, [year, month]);
      return result.values || [];
    });
  }

  async getBeneficiariesByExpenseDesc(year: string, month: string): Promise<{ name: string, total: number }[]> {
    return this._dbService.executeQuery(async (db) => {
      const query = `
      SELECT b.name AS name, SUM(e.amount) AS total
      FROM expense_item e
             JOIN beneficiaries b ON e.beneficiary_id = b.id
      WHERE e.spent = 1
        AND strftime('%Y', e.date) = ?
        AND strftime('%m', e.date) = ?
      GROUP BY b.name
      ORDER BY total DESC
    `;
      const result = await db.query(query, [year, month]);
      return result.values || [];
    });
  }



  async getExpenseItemsPaginated(page: number, pageSize: number = 10): Promise<any[]> {
    const offset = (page - 1) * pageSize;

    return this._dbService.executeQuery(async (db) => {
      const query = `
        SELECT e.id, e.date, e.item_name, e.amount, e.spent,
               c.name as category_name,
               b.name as beneficiary_name
        FROM expense_item e
               JOIN categories c ON e.category_id = c.id
               JOIN beneficiaries b ON e.beneficiary_id = b.id
        ORDER BY e.date DESC, e.id DESC
          LIMIT ? OFFSET ?
      `;
      const result = await db.query(query, [pageSize, offset]);
      return result.values || [];
    });
  }

  async getTotalExpenseCount(): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT COUNT(*) as count FROM expense_item`);
      return result.values?.[0]?.count || 0;
    });
  }

  async getAllExpenseItems(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT * FROM expense_item ORDER BY id ASC`);
      return result.values || [];
    });
  }

  async getLatestTransactions(): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT e.id,
                e.item_name,
                e.amount,
                e.date,
                c.id AS category_id,
                c.name AS category_name
         FROM expense_item e
                JOIN categories c ON e.category_id = c.id
         ORDER BY e.date DESC LIMIT 8`
      );

      return (result.values || []).map(row =>
        new Expense(
          row.item_name,
          row.amount,
          {id: row.category_id, name: row.category_name},
          row.date,
          row.spent,
          {id: row.beneficiary_id, name: row.beneficiary_name}
        )
      );
    });
  }

  async getExpenseTotalAmount(day: string): Promise<number> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT SUM(amount) as total
         FROM expense_item
         WHERE date = ?`,
        [day]
      );
      return result.values?.[0]?.total ?? 0;
    });
  }

  async getExpensesForDate(day: string): Promise<Expense[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
      `SELECT
                        e.id,
                        e.item_name,
                        e.amount,
                        e.date,
                        e.spent,
                        c.id AS category_id,
                        c.name AS category_name,
                        b.id as beneficiary_id,
                        b.name AS beneficiary_name
               FROM expense_item e
                    JOIN categories c ON e.category_id = c.id
                    JOIN beneficiaries b on e.beneficiary_id = b.id
               WHERE e.date = ?`,
                [day]
      );

      // Map DB rows to Expense instances
      return (result.values || []).map(row => {
          const newExpense = new Expense(
            row.item_name,
            row.amount,
            {id: row.category_id, name: row.category_name},
            row.date,
            row.spent,
            {id: row.beneficiary_id, name: row.beneficiary_name}
          );
          newExpense.id = row.id;
          return newExpense;
        }
      );
    });
  }

  async getPerDayTotalsForCurrentMonth() {
    const today = new Date();
    const yearMonth = today.toISOString().slice(0, 7);

    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `
          SELECT
            date,
            SUM(CASE WHEN spent = 1 THEN amount ELSE 0 END) AS spent,
            SUM(CASE WHEN spent = 0 THEN amount ELSE 0 END) AS received
          FROM expense_item
          WHERE strftime('%Y-%m', date) = ?
          GROUP BY date
          ORDER BY date DESC
        `,
        [yearMonth]
      );
      return result.values || [];
    });
  }

  async saveExpense(items: Expense[]): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      for (const item of items) {
        console.log(item);
        await db.run(
          `INSERT INTO expense_item ("date", item_name, amount, category_id, beneficiary_id, spent)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [item.date.trim(), item.itemName.trim(), item.amount, item.category.id, item.beneficiary.id, item.spent ? 1 : 0]
        );
      }
    });
  }

  async deleteExpense(id: number): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      await db.run(
        `DELETE FROM expense_item WHERE id = ?`,
        [id]
      );
      console.log(`Expense successfully deleted.`);
    });
  }

  async updateExpense(item: Expense): Promise<void> {
    await this._dbService.executeQuery<any>(async (db: SQLiteDBConnection) => {
      await db.run(
      `UPDATE expense_item
         SET date = ?,
             item_name = ?,
             amount = ?,
             category_id = ?,
             beneficiary_id = ?,
             spent = ?
         WHERE id = ?`,
          [
            item.date.trim(),
            item.itemName.trim(),
            item.amount,
            item.category.id,
            item.beneficiary.id,
            item.spent,
            item.id
          ]
        );
    });
  }


}
