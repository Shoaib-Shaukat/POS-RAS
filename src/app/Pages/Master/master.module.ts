import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { UnitsComponent } from './IngredientUnits/units.component';
import { FoodcategoryComponent } from './FoodMenuCategory/foodcategory.component';
import { CustomerComponent } from './Customers/customer.component';
import { ExpenseitemComponent } from './ExpenseItems/expenseitem.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { TableComponent } from './Tables/table.component';
import { MasterComponent } from './master.component';
import { SharedModule } from '../Shared/shared/shared.module';
import { FoodItemsComponent } from './FoodItems/food-items.component';
import { DataTablesModule } from 'angular-datatables';
import { DealsComponent } from './Deals/deals.component';
import { StaffComponent } from './Staff/staff.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IngredientcompaniesComponent } from './IngredientCompanies/ingredientcompanies.component';
import { IngredientSubCatComponent } from './IngredientsSubCategory/ingredient-sub-cat.component';
import { IngcategoriesComponent } from './IngredientCategories/ingcategories.component';



@NgModule({
  declarations: [
    MasterComponent,
    FoodcategoryComponent,
    CustomerComponent,
    ExpenseitemComponent,
    PaymentmethodComponent,
    TableComponent,
    FoodItemsComponent,
    DealsComponent,
    StaffComponent,
    IngcategoriesComponent,
    UnitsComponent,
    IngredientSubCatComponent,
    IngredientcompaniesComponent
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
