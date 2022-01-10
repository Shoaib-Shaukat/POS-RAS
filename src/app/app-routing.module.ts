import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllscreenComponent } from './Pages/All Screens/allscreen.component';
import { BarComponent } from './Pages/All Screens/Bar/bar.component';
import { KitchenComponent } from './Pages/All Screens/Kitchen/kitchen.component';
import { PosComponent } from './Pages/All Screens/POS/pos.component';
import { WaiterComponent } from './Pages/All Screens/Waiter/waiter.component';
import { CompaniesComponent } from './Pages/Companies/companies.component';
import { DashboardComponent } from './Pages/DashBoard/dashboard.component';
import { LoginComponent } from './Pages/Login/login.component';
import { OutletComponent } from './Pages/Outlet/outlet.component';
import { RegisterComponent } from './Pages/Register/register.component';
import { SaleComponent } from './Pages/Sale/sale.component';
import { LayoutComponent } from './Pages/Shared/Layout/layout.component';
import { Auth } from '../app/Services/GuardService/guard-service.service';
import { CurrencyComponent } from './Pages/Master/Currency/currency.component';
import { OrdersComponent } from './Pages/All Screens/Orders/orders.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [Auth], children: [
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Outlet', component: OutletComponent },
      { path: 'Sale', component: SaleComponent },
      { path: 'Companies', component: CompaniesComponent },
      { path: 'Users', component: RegisterComponent },
      { path: 'Currency', component: CurrencyComponent },
      {
        path: 'Master',
        loadChildren: () => import('../app/Pages/Master/master.module').then(module => module.MasterModule)
      },

      {
        path: 'AllScreen', component: AllscreenComponent, children: [
          { path: 'Pos', component: PosComponent },
          { path: 'Orders', component: OrdersComponent },
          { path: 'Kitchen', component: KitchenComponent },
          { path: 'Waiter', component: WaiterComponent },
          { path: 'Waiter', component: WaiterComponent },
          
        ]
      }

    ]
  },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
