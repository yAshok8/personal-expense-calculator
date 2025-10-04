import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment';
import { SQLiteService } from './sqlite.service';

@Injectable({
  providedIn: 'root'   // ensure singleton
})
export class DatabaseService {
  private db: SQLiteDBConnection | null = null;

  constructor(private sqlite: SQLiteService) {}

  private async getConnection(databaseName: string = environment.databaseName): Promise<SQLiteDBConnection> {
    if (this.db) {
      return this.db;
    }

    // First check if connection exists
    const isConn = await this.sqlite.isConnection(databaseName);
    let db: SQLiteDBConnection;

    if (isConn.result) {
      db = await this.sqlite.retrieveConnection(databaseName);
    } else {
      db = await this.sqlite.createConnection(databaseName, false, "no-encryption", 1);
      await db.open();
    }

    this.db = db;
    return this.db;
  }

  async executeQuery<T>(
    callback: (db: SQLiteDBConnection) => Promise<T>,
    databaseName: string = environment.databaseName
  ): Promise<T> {
    try {
      const db = await this.getConnection(databaseName);
      return await callback(db);
    } catch (error) {
      throw Error(`DatabaseServiceError: ${error}`);
    }
  }
}
