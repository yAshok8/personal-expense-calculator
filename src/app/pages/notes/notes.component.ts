import {Component} from '@angular/core';
import {NotesService} from "../../services/notes.service";
import {ToastController} from "@ionic/angular";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {

  notes: any[] = [];
  isLoading = true;
  newNote = '';

  constructor(
    private notesService: NotesService,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.loadNotes();
  }

  async loadNotes() {
    this.isLoading = true;
    this.notes = await this.notesService.fetchNotesForCurrentMonth();
    this.isLoading = false;
  }

  async addNote() {
    if (!this.newNote.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'Note cannot be empty',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      await this.notesService.addNoteForDate(new Date().toISOString().split('T')[0], this.newNote.trim());
      this.newNote = '';
      await this.loadNotes();

      const toast = await this.toastCtrl.create({
        message: 'Note added successfully',
        duration: 1500,
        color: 'success'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error adding note (maybe duplicate)',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async deleteNote(id: number) {
    try {
      await this.notesService.deleteNote(id);
      await this.loadNotes();

      const toast = await this.toastCtrl.create({
        message: 'Note deleted',
        duration: 1500,
        color: 'medium'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Error deleting note',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

}
