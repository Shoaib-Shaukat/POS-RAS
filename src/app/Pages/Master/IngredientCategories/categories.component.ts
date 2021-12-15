import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/API/api.service';
import Swal from 'sweetalert2';
import { IngredientCategoryRequest } from './Modal/ingredient-category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  addMode: boolean = false;
  isShow = false;
  IngredientCategoryRequest = new IngredientCategoryRequest();
  IngredientCategoryResponse: any = [];
  ingredientCategoryForm: FormGroup;
  addNewCategories() {
    this.isShow = !this.isShow;
    this.addMode = false;
    this.ingredientCategoryForm.reset();
  }
  constructor(private api: ApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.ingredientCategoryForm = new FormGroup({});
    this.IngredientCategoryResponse = [];
    this.IngredientCategoryRequest = new IngredientCategoryRequest();
  }
  InitializeForm(): any {
    this.ingredientCategoryForm = new FormGroup({
      categoryname: new FormControl(''),
      description: new FormControl(''),
      ingredientCategoryID: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.GetIngredientCategory();
  }
  onIngredientCategory() {
    this.GetIngredientCategory();
  }
  SaveIngredientCategory(status: any) {

    if (status == 'New') {
      this.IngredientCategoryRequest.ingredientCategoryID = 0;
    } else {
      this.IngredientCategoryRequest.ingredientCategoryID =
        this.ingredientCategoryForm.controls.ingredientCategoryID.value;
    }
    this.IngredientCategoryRequest.name = this.ingredientCategoryForm.controls.categoryname.value;
    this.IngredientCategoryRequest.description = this.ingredientCategoryForm.controls.description.value;
    this.api
    // .addIngredientCategory(this.IngredientCategoryRequest)
    // .pipe(first())
    // .subscribe({
    //   next: () => {
    //     // get return url from query parameters or default to home page
    //     const returnUrl =
    //       this.route.snapshot.queryParams['returnUrl'] || '/Master/Customer';
    //     Swal.fire({
    //       text: 'Ingredient Category added successfully.',
    //       icon: 'success',
    //       confirmButtonText: 'OK',
    //     });
    //     this.isShow = !this.isShow;
    //     this.GetIngredientCategory();
    //   },
    //   error: (error) => {
    //     Swal.fire({
    //       text: error.error.Message,
    //       icon: 'error',
    //       confirmButtonText: 'OK',
    //     });
    //     // this.loading = false;
    //   },
    // });
  }
  GetIngredientCategory() {
    // this.api.getIngredientCategory().subscribe(
    //   (data) => {
    //     this.IngredientCategoryResponse = data;
    //   },
    //   (err) => {}
    // );
  }
  EditIngredientCategory(ingredient: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    //this.customerForm.patchValue(customer);
    this.ingredientCategoryForm.controls.ingredientCategoryID.setValue(ingredient.ingredientCategoryID);
    this.ingredientCategoryForm.controls.categoryname.setValue(ingredient.name);
    this.ingredientCategoryForm.controls.description.setValue(ingredient.description);
  }
}
