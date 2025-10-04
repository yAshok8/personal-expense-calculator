import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root',
})
export class ExpenseBeneficiaryService {

  constructor(private _dbService: DatabaseService) {
  }

  async fetchAllBeneficiaries(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(`SELECT * FROM beneficiaries ORDER BY id ASC`);
      return result.values || [];
    });
  }

  async getBeneficiaryTotalsForMonth(year: number, month: number): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const monthStr = month.toString().padStart(2, '0');
      const query = `
        SELECT b.id, b.name, SUM(e.amount) AS total
        FROM expense_item e
               JOIN beneficiaries b ON e.beneficiary_id = b.id
        WHERE e.spent = 1
          AND strftime('%Y', e.date) = ?
          AND strftime('%m', e.date) = ?
        GROUP BY b.id, b.name
        ORDER BY total DESC
      `;
      const result = await db.query(query, [year.toString(), monthStr]);
      return result.values || [];
    });
  }


}
