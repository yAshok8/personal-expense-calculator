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

}
