import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/API/api.service';
import Swal from 'sweetalert2';
import { IngredientRequest } from './Modal/ingredient';

@Component({
  selector: 'app-ingredient',
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.css'],
})
export class IngredientComponent implements OnInit {
  addMode: boolean = false;
  ingredientForm: FormGroup;
  isShow = false;
  ingredientRequest = new IngredientRequest();
  IngredientResponse: any = [];
  unitResponse: any = [];
  IngredientCategory: any = [];
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.ingredientForm = new FormGroup({});
    this.IngredientResponse = [];
    this.unitResponse = [];
    this.IngredientCategory = [];
    this.ingredientRequest = new IngredientRequest();
  }
  addNewIngredient() {
    this.ingredientForm.reset();
    this.isShow = !this.isShow;
  }
  InitializeForm() {
    this.ingredientForm = new FormGroup({
      name: new FormControl(''),
      ingredientCategoryID: new FormControl(''),
      unit: new FormControl(''),
      purchaseprice: new FormControl(''),
      alertqty: new FormControl(''),
      code: new FormControl(''),
      ingredientID: new FormControl(''),
      Category: new FormControl(''),
    });
  }
  ngOnInit(): void {
    this.InitializeForm();
    this.GetIngredientCategory();
    this.getUnit();
    this.getIngredient();
  }
  onIgredientSubmit() {
    console.log(this.ingredientForm);
  }
  GetIngredientCategory() {
    // this.api.getIngredientCategory().subscribe(
    //   (data) => {
    //     this.IngredientCategory = data;
    //   },
    //   (err) => {}
    // );
  }
  getUnit() {
    // this.api.getUnit().subscribe(
    //   (data) => {
    //     this.unitResponse = data;
    //   },
    //   (err) => {}
    // );
  }
  SaveIngredient(status: any) {
    if (status == 'New') {
      this.ingredientRequest.ingredientID = 0;
    } else {
      this.ingredientRequest.ingredientID = this.ingredientForm.controls.ingredientID.value;
    }
    this.ingredientRequest.Name = this.ingredientForm.controls.name.value;
    this.ingredientRequest.Category = this.ingredientForm.controls.Category.value;
    this.ingredientRequest.ingredientCategoryID = this.ingredientForm.controls.ingredientCategoryID.value;
    this.ingredientRequest.Code = this.ingredientForm.controls.code.value;
    this.ingredientRequest.Unit = this.ingredientForm.controls.unit.value;
    this.ingredientRequest.alertQty = this.ingredientForm.controls.alertqty.value;
    this.ingredientRequest.purchasePrice = this.ingredientForm.controls.purchaseprice.value;
    this.api
    // .addIngredient(this.ingredientRequest)
    // .pipe(first())
    // .subscribe({
    //   next: () => {
    //     // get return url from query parameters or default to home page
    //     const returnUrl =
    //       this.route.snapshot.queryParams['returnUrl'] || '/Master/Customer';
    //     Swal.fire({
    //       text: 'Customer added successfully.',
    //       icon: 'success',
    //       confirmButtonText: 'OK',
    //     });
    //     this.isShow = !this.isShow;
    //     this.getIngredient();
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
  getIngredient() {
    // this.api.getIngredient().subscribe(
    //   (data) => {
    //     this.IngredientResponse = data;
    //   },
    //   (err) => {}
    // );
  }
  changeCategory() {
    var ingredientDetail = this.IngredientCategory.find(
      (x: any) =>
        x.ingredientCategoryID ==
        this.ingredientForm.controls.ingredientCategoryID.value
    );

    if (ingredientDetail != undefined) {
      if (ingredientDetail.name != null) {
        this.ingredientForm.controls.Category.setValue(ingredientDetail.name);
      } else {
        this.ingredientForm.controls.Category.setValue('');
      }
    } else {
      this.ingredientForm.controls.Category.setValue('');
    }
  }
  EditIngredient(ingredient: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    //this.customerForm.patchValue(customer);
    this.ingredientForm.controls.ingredientID.setValue(ingredient.ingredientID);
    this.ingredientForm.controls.name.setValue(ingredient.name);
    this.ingredientForm.controls.Category.setValue(ingredient.category);
    this.ingredientForm.controls.ingredientCategoryID.setValue(ingredient.ingredientCategoryId);
    this.ingredientForm.controls.code.setValue(ingredient.code);
    this.ingredientForm.controls.unit.setValue(ingredient.unit);
    this.ingredientForm.controls.alertqty.setValue(ingredient.alertQty);
    this.ingredientForm.controls.purchaseprice.setValue(ingredient.purchasePrice);
  }
}
