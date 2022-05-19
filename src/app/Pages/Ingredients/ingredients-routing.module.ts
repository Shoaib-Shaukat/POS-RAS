import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngcategoriesComponent } from './IngredientCategories/ingcategories.component';
import { IngredientcompaniesComponent } from './IngredientCompanies/ingredientcompanies.component';
import { ProductComponent } from './Ingredients-Products-Items/product.component';
import { IngredientSubCatComponent } from './IngredientsSubCategory/ingredient-sub-cat.component';
import { UnitsComponent } from './IngredientUnits/units.component';

const routes: Routes = [
  { path: 'IngCategories', component: IngcategoriesComponent },
  { path: 'IngredientSubCat', component: IngredientSubCatComponent },
  { path: 'Units', component: UnitsComponent },
  { path: 'Ingredientcompanies', component: IngredientcompaniesComponent },
  { path: 'Products', component: ProductComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientsRoutingModule { }
