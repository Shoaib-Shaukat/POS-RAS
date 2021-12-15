import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/API/api.service';
import Swal from 'sweetalert2';
import { UnitRequest } from './Modal/unit';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dataTable: any;
  addMode: boolean = false;
  UnitRequest = new UnitRequest();
  UnitResponse: any = [];
  ingredientUnitForm: FormGroup;
  isShow = false;
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.UnitResponse = [];
    this.ingredientUnitForm = new FormGroup({});
    this.UnitRequest = new UnitRequest();
  }
  addNewUnits() {
    this.isShow = !this.isShow;
  }
  InitializeForm(): any {
    this.ingredientUnitForm = new FormGroup({
      categoryname: new FormControl(''),
      description: new FormControl(''),
      unitID: new FormControl(''),
    });
  }
  ngOnInits() {
    setTimeout(() => {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu: [5, 10, 25],
        processing: true,
      };
    }, 100);
  }
  ngOnInit(): void {
    this.ngOnInits();
    this.InitializeForm();
    this.getUnit();
  }
  onIngredientUnitSubmit() { }
  SaveUnit(status: any) {
    if (status == 'New') {
      this.UnitRequest.unitID = 0;
    } else {
      this.UnitRequest.unitID = this.ingredientUnitForm.controls.unitID.value;
    }
    this.UnitRequest.Name = this.ingredientUnitForm.controls.categoryname.value;
    this.UnitRequest.Description =
      this.ingredientUnitForm.controls.description.value;
    // this.api
    //   .addUnit(this.UnitRequest)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       // get return url from query parameters or default to home page
    //       const returnUrl =
    //         this.route.snapshot.queryParams['returnUrl'] || '/Master/Customer';
    //       Swal.fire({
    //         text: 'Units added successfully.',
    //         icon: 'success',
    //         confirmButtonText: 'OK',
    //       });
    //       this.isShow = !this.isShow;
    //       this.getUnit();
    //     },
    //     error: (error) => {
    //       Swal.fire({
    //         text: error.error.Message,
    //         icon: 'error',
    //         confirmButtonText: 'OK',
    //       });
    //       // this.loading = false;
    //     },
    //   });
  }
  getUnit() {
    // this.api.getUnit().subscribe(
    //   (data) => {
    //     this.UnitResponse = data;
    //   },
    //   (err) => {}
    // );
  }
  EditUnit(unit: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    //this.customerForm.patchValue(customer);
    this.ingredientUnitForm.controls.unitID.setValue(unit.unitID);
    this.ingredientUnitForm.controls.categoryname.setValue(unit.name);
    this.ingredientUnitForm.controls.description.setValue(unit.description);
  }
}
