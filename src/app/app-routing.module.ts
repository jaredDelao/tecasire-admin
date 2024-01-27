import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { Shell } from '@app/shell/shell.service';

const routes: Routes = [
  Shell.childRoutes([
    {
      path: 'profile',
      loadChildren: () => import('./pages/profile/profile.module').then((m) => m.ProfileModule),
    },
    { path: 'about', loadChildren: () => import('./about/about.module').then((m) => m.AboutModule) },
    { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then((m) => m.OrdersModule) },
    {
      path: 'user-management',
      loadChildren: () => import('./pages/user-management/user-management.module').then((m) => m.UserManagementModule),
    },
    {
      path: 'settings',
      loadChildren: () => import('./pages/settings/settings.module').then((m) => m.SettingsModule),
    },
    {
      path: 'auditoria',
      loadChildren: () => import('./pages/auditoria/auditoria.module').then((m) => m.AuditoriaModule),
    },
    {
      path: 'postal-codes',
      loadChildren: () => import('./pages/postal-codes/postal-codes.module').then((m) => m.PostalCodesModule),
    },
    {
      path: 'products',
      loadChildren: () => import('./pages/products/products.module').then((m) => m.ProductsModule),
    },
    {
      path: 'chat',
      loadChildren: () => import('./@chat/chat.module').then((m) => m.ChatModule),
    },
  ]),
  // Fallback when no prior route is matched
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
