import {Injectable} from '@angular/core';
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root',
})
export class NotesService {

  constructor(private _dbService: DatabaseService) {
  }

  async fetchNotesForCurrentMonth(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT *
         FROM notes
         WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
         ORDER BY date DESC`
      );
      return result.values || [];
    });
  }

  async addNoteForDate(date: string, name: string): Promise<void> {
    return this._dbService.executeQuery(async (db) => {
      await db.run(
        `INSERT INTO notes (date, name, created_at, updated_at)
       VALUES (?, ?, datetime('now'), datetime('now'))`,
        [date, name]
      );
    });
  }

  async deleteNote(id: number): Promise<void> {
    return this._dbService.executeQuery(async (db) => {
      await db.run(`DELETE FROM notes WHERE id = ?`, [id]);
    });
  }

  async fetchAllNotes(): Promise<any[]> {
    return this._dbService.executeQuery(async (db) => {
      const result = await db.query(
        `SELECT id, date, name, created_at, updated_at
         FROM notes
        ORDER BY date ASC`
      );
      return result.values || [];
    });
  }



}
