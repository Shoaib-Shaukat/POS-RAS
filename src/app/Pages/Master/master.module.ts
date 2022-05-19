import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { FoodcategoryComponent } from './MenuCategories/foodcategory.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { TableComponent } from './Tables/table.component';
import { MasterComponent } from './master.component';
import { SharedModule } from '../Shared/shared/shared.module';
import { FoodItemsComponent } from './MenuItems/food-items.component';
import { DataTablesModule } from 'angular-datatables';
import { DealsComponent } from './Deals/deals.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SectionComponent } from './Sections/section.component';
import { VendorsComponent } from './Vendors/vendors.component';
import { LocationsComponent } from './Locations/locations.component';
import { PurchaseComponent } from './Purchase/purchase.component';
import { MenulistComponent } from './MenuList/menulist.component';
import { TaxesComponent } from './Taxes/taxes.component';



@NgModule({
  declarations: [
    MasterComponent,
    FoodcategoryComponent,
    PaymentmethodComponent,
    TableComponent,
    FoodItemsComponent,
    DealsComponent,
    SectionComponent,
    VendorsComponent,
    LocationsComponent,
    PurchaseComponent,
    MenulistComponent,
    TaxesComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    DataTablesModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class MasterModule {
  moduleIn: string = "I am in Master Module";
  constructor() {
    console.log(this.moduleIn);
  }
}
