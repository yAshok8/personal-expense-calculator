import { Component, Input } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-popover',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-content class="ion-padding">
      <h2>{{ note?.name }}</h2>
      <p>{{ note?.date | date:'mediumDate' }}</p>
      <p>{{ note?.content }}</p>
      <ion-button expand="block" (click)="close()">Close</ion-button>
    </ion-content>
  `
})
export class NotePopoverComponent {
  @Input() note: any;

  constructor(private popoverCtrl: PopoverController) {}

  close() {
    this.popoverCtrl.dismiss();
  }
}
