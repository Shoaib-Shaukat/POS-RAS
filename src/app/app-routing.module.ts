import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllscreenComponent } from './Pages/All Screens/allscreen.component';
import { KitchenComponent } from './Pages/All Screens/Kitchen/kitchen.component';
import { PosComponent } from './Pages/All Screens/POS/pos.component';
import { CompaniesComponent } from './Pages/Main/Companies/companies.component';
import { DashboardComponent } from './Pages/Main/DashBoard/dashboard.component';
import { LoginComponent } from './Pages/Main/Login/login.component';
import { OutletComponent } from './Pages/Main/Outlet/outlet.component';
import { RegisterComponent } from './Pages/Register/register.component';
import { SaleComponent } from './Pages/Sale/sale.component';
import { LayoutComponent } from './Pages/Shared/Layout/layout.component';
import { Auth } from '../app/Services/GuardService/guard-service.service';
import { CurrencyComponent } from './Pages/Main/Currency/currency.component';
import { OrdersComponent } from './Pages/All Screens/Orders/orders.component';
import { UsersComponent } from './Pages/Main/Users/users.component';
import { CustomerComponent } from './Pages/Main/Customers/customer.component';
import { GenericComponent } from './Pages/All Screens/Generic/generic.component';
import { DayOpenCloseComponent } from './Pages/Main/DayOpenClose/day-open-close.component';
import { EmailmoduleComponent } from './Pages/Main/EmailModule/emailmodule.component';
const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [Auth], children: [
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Outlet', component: OutletComponent },
      { path: 'Sale', component: SaleComponent },
      { path: 'Companies', component: CompaniesComponent },
      { path: 'Register', component: RegisterComponent },
      { path: 'Currency', component: CurrencyComponent },
      { path: 'Users', component: UsersComponent },
      { path: 'Customers', component: CustomerComponent },
      { path: 'DayOpenClose', component: DayOpenCloseComponent },
      { path: 'EmailModule', component: EmailmoduleComponent },

      {
        path: 'Master',
        loadChildren: () => import('../app/Pages/Master/master.module').then(module => module.MasterModule)
      },
      {
        path: 'Ingredients',
        loadChildren: () => import('../app/Pages/Ingredients/ingredients.module').then(module => module.IngredientsModule)
      },

      {
        path: 'AllScreen', component: AllscreenComponent, children: [
          { path: 'Pos', component: PosComponent },
          { path: 'Orders', component: OrdersComponent },
          { path: 'Kitchen', component: KitchenComponent },
          { path: 'Generic', component: GenericComponent },
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
