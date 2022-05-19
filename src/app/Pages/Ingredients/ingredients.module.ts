import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngredientsRoutingModule } from './ingredients-routing.module';
import { IngcategoriesComponent } from './IngredientCategories/ingcategories.component';
import { UnitsComponent } from './IngredientUnits/units.component';
import { IngredientSubCatComponent } from './IngredientsSubCategory/ingredient-sub-cat.component';
import { IngredientcompaniesComponent } from './IngredientCompanies/ingredientcompanies.component';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../Shared/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ProductComponent } from './Ingredients-Products-Items/product.component';


@NgModule({
  declarations: [
    IngcategoriesComponent,
    UnitsComponent,
    IngredientSubCatComponent,
    IngredientcompaniesComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    IngredientsRoutingModule,
    DataTablesModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class IngredientsModule {
  moduleIn: string = "I am in Ingredients Module";
  constructor() {
    console.log(this.moduleIn);
  }
}
