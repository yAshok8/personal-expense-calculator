import { Component } from '@angular/core';
import {MenuController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.page.html'
})
export class SidebarPage {
  constructor(
    private menu: MenuController,
    private router: Router,
  ) {}

  navigate(route: string) {
    this.router.navigateByUrl(route).then(() => {
      this.menu.close('sidebarMenu');
    });
  }

}
