import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterRoutingModule } from './master-routing.module';
import { CategoriesComponent } from './IngredientCategories/categories.component';
import { UnitsComponent } from './IngredientUnits/units.component';
import { IngredientComponent } from './Ingredients/ingredient.component';
import { FoodcategoryComponent } from './FoodMenuCategory/foodcategory.component';
import { CustomerComponent } from './Customers/customer.component';
import { ExpenseitemComponent } from './ExpenseItems/expenseitem.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { TableComponent } from './Tables/table.component';
import { MasterComponent } from './master.component';
import { SharedModule } from '../Shared/shared/shared.module';
import { FoodItemsComponent } from './FoodItems/food-items.component';
import { AppComponent } from 'src/app/app.component';
import { DataTablesModule } from 'angular-datatables';
import { DealsComponent } from './Deals/deals.component';



@NgModule({
  declarations: [
    MasterComponent,
    CategoriesComponent,
    UnitsComponent,
    IngredientComponent,
    FoodcategoryComponent,
    CustomerComponent,
    ExpenseitemComponent,
    PaymentmethodComponent,
    TableComponent,
    FoodItemsComponent,
    DealsComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    DataTablesModule,
    SharedModule
  ]
})
export class MasterModule {

  moduleIn: string = "I am in Master Module";
  constructor() {
    console.log(this.moduleIn);
  }
}
