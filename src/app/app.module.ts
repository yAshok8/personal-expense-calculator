import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SQLiteService} from './services/sqlite.service';
import {InitializeAppService} from './services/initialize.app.service';

import {MigrationService} from './services/migrations.service';
import {DatabaseService} from './services/database.service';
import {FormsModule} from "@angular/forms";
import {TabsPageModule} from "./pages/tabs/tabs.module";
import { ProfileComponent } from './pages/profile/profile.component';
import {NgChartsModule} from "ng2-charts";
import {SidebarPageModule} from "./pages/sidebar/sidebar.module";

export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}

@NgModule({
    declarations: [AppComponent, ProfileComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        TabsPageModule,
        NgChartsModule,
        SidebarPageModule
    ],
    providers: [
        SQLiteService,
        DatabaseService,
        InitializeAppService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeFactory,
            deps: [InitializeAppService],
            multi: true
        },
        MigrationService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
