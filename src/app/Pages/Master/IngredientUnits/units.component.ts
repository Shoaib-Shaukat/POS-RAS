import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { unitRequest, unitResponse } from './IngredientUnitsModel';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  unitRequest: unitRequest;
  unitResponse: unitResponse[];
  addMode: boolean = false;
  submitted: boolean = false;
  UnitForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.unitResponse = [];
    this.unitRequest = new unitRequest();

  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getUnits();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  InitializeForm() {
    this.UnitForm = new FormGroup({
      unitID: new FormControl(""),
      Name: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      UserID: new FormControl(""),
      outletID: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.UnitForm.controls; }

  addUnit() {
    this.submitted = false;
    this.UnitForm.reset();
    this.isShow = !this.isShow;
    this.addMode = true;
  }

  saveUnitInfo() {
    this.submitted = true;
    if (this.UnitForm.valid) {
      if (this.UnitForm.controls.unitID.value == "" || this.UnitForm.controls.unitID.value == null) {
        this.UnitForm.controls.unitID.setValue(0);
      }
      this.UnitForm.controls.UserID.setValue(this.GV.userID);
      this.UnitForm.controls.outletID.setValue(this.GV.OutletID);
      this.unitRequest = this.UnitForm.value;
      this.API.PostData('/Ingredient/AddEditUnit', this.unitRequest).subscribe(c => {
        if (c != null) {
          if (c.status == "Failed") {
            this.toastr.error(c.message, 'Error', {
              timeOut: 3000,
              'progressBar': true,
            });
            return;
          }
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.isShow = !this.isShow;
          this.getUnits();
        }
      },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    }
  }

  getUnits() {
    this.API.getdata('/Ingredient/getUnit?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.unitResponse = c.unitResponse;
          this.dtTrigger.next();
        });
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  editUnit(p: any) {
    this.addMode = false;
    this.isShow = !this.isShow;
    this.UnitForm.controls.unitID.patchValue(p.unitID);
    this.UnitForm.controls.Name.patchValue(p.name);
    this.UnitForm.controls.isActive.patchValue(p.isActive);
    this.UnitForm.controls.OutletID.patchValue(p.outletID);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.UnitForm.controls.isActive.setValue(true);
    } else {
      this.UnitForm.controls.isActive.setValue(false);
    }
  }
  destroyDT = (tableIndex: any, clearData: any): Promise<boolean> => {
    return new Promise((resolve) => {
      if (this.datatableElement)
        this.datatableElement.forEach((dtElement: DataTableDirective, index) => {

          if (index == tableIndex) {
            if (dtElement.dtInstance) {

              if (tableIndex == 0) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 1) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              } else if (tableIndex == 2) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
              else if (tableIndex == 3) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });

              }
              else if (tableIndex == 4) {
                dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  if (clearData) {
                    dtInstance.clear();
                  }
                  dtInstance.destroy();
                  resolve(true);
                });
              }
            }
            else {
              resolve(true);
            }
          }
        });
    });
  };
}