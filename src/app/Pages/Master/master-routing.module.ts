import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './Customers/customer.component';
import { DealsComponent } from './Deals/deals.component';
import { ExpenseitemComponent } from './ExpenseItems/expenseitem.component';
import { FoodItemsComponent } from './FoodItems/food-items.component';
import { FoodcategoryComponent } from './FoodMenuCategory/foodcategory.component';
import { IngcategoriesComponent } from './IngredientCategories/ingcategories.component';
import { IngredientcompaniesComponent } from './IngredientCompanies/ingredientcompanies.component';
import { IngredientSubCatComponent } from './IngredientsSubCategory/ingredient-sub-cat.component';
import { UnitsComponent } from './IngredientUnits/units.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { StaffComponent } from './Staff/staff.component';
import { TableComponent } from './Tables/table.component';

const routes: Routes = [
  { path: 'FoodMenuCat', component: FoodcategoryComponent },
  { path: 'Customer', component: CustomerComponent },
  { path: 'Expense', component: ExpenseitemComponent },
  { path: 'PaymentMethod', component: PaymentmethodComponent },
  { path: 'Table', component: TableComponent },
  { path: 'Items', component: FoodItemsComponent },
  { path: 'Deals', component: DealsComponent },
  { path: 'Staff', component: StaffComponent },
  { path: 'IngCategories', component: IngcategoriesComponent },
  { path: 'IngredientSubCat', component: IngredientSubCatComponent },
  { path: 'Units', component: UnitsComponent },
  { path: 'Ingredientcompanies', component: IngredientcompaniesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
