  import { NgModule } from '@angular/core';
  import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
  import {SidebarPage} from "./pages/sidebar/sidebar.component";

  const routes: Routes = [
    {
      path: '',
      redirectTo: '/tabs/home',
      pathMatch: 'full'
    },
    {
      path: 'tabs',
      loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
    },
    // {
    //   path: 'sidebar',
    //   loadChildren: () => import('./pages/sidebar/sidebar.module').then(m => m.SidebarPageModule)
    // },
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
