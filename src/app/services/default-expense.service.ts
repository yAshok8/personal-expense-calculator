import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface DefaultExpense {
  id?: number;
  name: string;
  amount: number;
  beneficiaryId: number | null;
  beneficiaryName: string;
}

@Injectable({
  providedIn: 'root',
})
export class DefaultExpenseDbService {
  constructor(private _dbService: DatabaseService) {}

  async getAllDefaultExpenses(): Promise<any[]> {
    return this._dbService.executeQuery(async (db: SQLiteDBConnection) => {
      const query = `
        SELECT de.id, de.name, de.amount, de.beneficiaryId, b.name as beneficiaryName
        FROM default_expense de
               LEFT JOIN beneficiaries b ON de.beneficiaryId = b.id
        ORDER BY de.id DESC
      `;
      const result = await db.query(query);
      return result.values || [];
    });
  }

  async addDefaultExpense(expense: DefaultExpense): Promise<void> {
    return this._dbService.executeQuery(async (db: SQLiteDBConnection) => {
      const query = `
        INSERT INTO default_expense (name, amount, beneficiaryId)
        VALUES (?, ?, ?)
      `;
      await db.run(query, [expense.name, expense.amount, expense.beneficiaryId]);
    });
  }

  async updateDefaultExpense(expense: DefaultExpense): Promise<void> {
    return this._dbService.executeQuery(async (db: SQLiteDBConnection) => {
      const query = `
        UPDATE default_expense
        SET name = ?, amount = ?, beneficiaryId = ?
        WHERE id = ?
      `;
      await db.run(query, [expense.name, expense.amount, expense.beneficiaryId, expense.id]);
    });
  }

  async deleteDefaultExpense(id: number): Promise<void> {
    return this._dbService.executeQuery(async (db: SQLiteDBConnection) => {
      const query = `DELETE FROM default_expense WHERE id = ?`;
      await db.run(query, [id]);
    });
  }

  async getTotalDefaultExpenseAmount(): Promise<number> {
    return this._dbService.executeQuery(async (db: SQLiteDBConnection) => {
      const query = `SELECT SUM(amount) AS total FROM default_expense`;
      const result = await db.query(query);

      // If table is empty or NULL result, return 0
      if (result.values && result.values.length > 0 && result.values[0].total !== null) {
        return result.values[0].total;
      }
      return 0;
    });
  }

}
