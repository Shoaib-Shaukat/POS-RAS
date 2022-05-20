import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DataTablesModule } from 'angular-datatables';
import { LoginComponent } from './Pages/Main/Login/login.component';
import { OutletComponent } from './Pages/Main/Outlet/outlet.component';
import { LayoutComponent } from './Pages/Shared/Layout/layout.component';
import { LeftmenuComponent } from './Pages/Shared/LeftMenu/leftmenu.component';
import { ToparComponent } from './Pages/Shared/TopBar/topar.component';
import { FooterComponent } from './Pages/Shared/Footer/footer.component';
import { DashboardComponent } from './Pages/Main/DashBoard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllscreenComponent } from './Pages/All Screens/allscreen.component';
import { PosComponent } from './Pages/All Screens/POS/pos.component';
import { BarComponent } from './Pages/All Screens/Bar/bar.component';
import { KitchenComponent } from './Pages/All Screens/Kitchen/kitchen.component';
import { SaleComponent } from './Pages/Sale/sale.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './Pages/Register/register.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CompaniesComponent } from './Pages/Main/Companies/companies.component'
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './Pages/Shared/shared/shared.module';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ApiService } from './Services/API/api.service';
import { Auth } from './Services/GuardService/guard-service.service';
import { TwoDigitDecimalNumberDirective } from './Pages/two-digit-decimal-number.directive';
import { CurrencyComponent } from './Pages/Main/Currency/currency.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPrintModule } from 'ngx-print';
import { OrdersComponent } from './Pages/All Screens/Orders/orders.component';
import { UsersComponent } from './Pages/Main/Users/users.component';
import { IngredientsComponent } from './Pages/Ingredients/ingredients.component';
import { CustomerComponent } from './Pages/Main/Customers/customer.component';
import { GenericComponent } from './Pages/All Screens/Generic/generic.component';
import { DayOpenCloseComponent } from './Pages/Main/DayOpenClose/day-open-close.component';
import { EmailmoduleComponent } from './Pages/Main/EmailModule/emailmodule.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OutletComponent,
    LayoutComponent,
    LeftmenuComponent,
    ToparComponent,
    FooterComponent,
    DashboardComponent,
    AllscreenComponent,
    PosComponent,
    BarComponent,
    KitchenComponent,
    SaleComponent,
    RegisterComponent,
    CompaniesComponent,
    CurrencyComponent,
    TwoDigitDecimalNumberDirective,
    OrdersComponent,
    UsersComponent,
    IngredientsComponent,
    CustomerComponent,
    GenericComponent,
    DayOpenCloseComponent,
    EmailmoduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule,
    BrowserAnimationsModule,
    SharedModule,
    DataTablesModule,
    NgxPrintModule,
    NgxQRCodeModule,
    NguiAutoCompleteModule,
    NgxMaskModule.forRoot(maskConfig),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [ApiService, Auth, ToastrService, HttpClientModule, { provide: LocationStrategy, useClass: HashLocationStrategy }],

  bootstrap: [AppComponent]

})
export class AppModule {

  moduleIn: string = "I am in App Module";
  constructor() {
    console.log(this.moduleIn);
  }

}
