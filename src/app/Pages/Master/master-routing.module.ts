import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealsComponent } from './Deals/deals.component';
import { FoodItemsComponent } from './MenuItems/food-items.component';
import { FoodcategoryComponent } from './MenuCategories/foodcategory.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { TableComponent } from './Tables/table.component';
import { SectionComponent } from './Sections/section.component';
import { VendorsComponent } from './Vendors/vendors.component';
import { LocationsComponent } from './Locations/locations.component';
import { PurchaseComponent } from './Purchase/purchase.component';
import { MenulistComponent } from './MenuList/menulist.component';
import { TaxesComponent } from './Taxes/taxes.component';

const routes: Routes = [
  { path: 'FoodMenuCat', component: FoodcategoryComponent },
  { path: 'PaymentMethod', component: PaymentmethodComponent },
  { path: 'Table', component: TableComponent },
  { path: 'Items', component: FoodItemsComponent },
  { path: 'Deals', component: DealsComponent },
  { path: 'Sections', component: SectionComponent },
  { path: 'Vendors', component: VendorsComponent },
  { path: 'Locations', component: LocationsComponent },
  { path: 'Purchase', component: PurchaseComponent },
  { path: 'MenuList', component: MenulistComponent },
  { path: 'Taxes', component: TaxesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
