import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './Customers/customer.component';
import { DealsComponent } from './Deals/deals.component';
import { ExpenseitemComponent } from './ExpenseItems/expenseitem.component';
import { FoodItemsComponent } from './FoodItems/food-items.component';
import { FoodcategoryComponent } from './FoodMenuCategory/foodcategory.component';
import { CategoriesComponent } from './IngredientCategories/categories.component';
import { IngredientComponent } from './Ingredients/ingredient.component';
import { UnitsComponent } from './IngredientUnits/units.component';
import { PaymentmethodComponent } from './PaymentMethod/paymentmethod.component';
import { TableComponent } from './Tables/table.component';

const routes: Routes = [
  { path: 'Categories', component: CategoriesComponent },
  { path: 'Units', component: UnitsComponent },
  { path: 'Ingredient', component: IngredientComponent },
  { path: 'FoodMenuCat', component: FoodcategoryComponent },
  { path: 'Customer', component: CustomerComponent },
  { path: 'Expense', component: ExpenseitemComponent },
  { path: 'PaymentMethod', component: PaymentmethodComponent },
  { path: 'Table', component: TableComponent },
  { path: 'Items', component: FoodItemsComponent },
  { path: 'Deals', component: DealsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
