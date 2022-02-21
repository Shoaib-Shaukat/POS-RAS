import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { IngCompanyRequest, IngCompanyResponse } from './ingCompModel';

@Component({
  selector: 'app-ingredientcompanies',
  templateUrl: './ingredientcompanies.component.html',
  styleUrls: ['./ingredientcompanies.component.css']
})
export class IngredientcompaniesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  IngCompanyRequest: IngCompanyRequest;
  IngCompanyResponse: IngCompanyResponse[];
  addMode: boolean = false;
  submitted: boolean = false;
  IngCompaniesForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.IngCompanyResponse = [];
    this.IngCompanyRequest = new IngCompanyRequest();

  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getCompanies();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  InitializeForm() {
    this.IngCompaniesForm = new FormGroup({
      ingredientCompanyID: new FormControl(""),
      ingredientCompanyName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
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

  get f() { return this.IngCompaniesForm.controls; }

  addIngComp() {
    this.submitted = false;
    this.IngCompaniesForm.reset();
    this.isShow = !this.isShow;
    this.addMode = true;
  }
  saveIngCompInfo() {
    this.submitted = true;
    if (this.IngCompaniesForm.valid) {
      if (this.IngCompaniesForm.controls.ingredientCompanyID.value == "" || this.IngCompaniesForm.controls.ingredientCompanyID.value == null) {
        this.IngCompaniesForm.controls.ingredientCompanyID.setValue(0);
      }
      this.IngCompaniesForm.controls.UserID.setValue(this.GV.userID);
      this.IngCompaniesForm.controls.outletID.setValue(this.GV.OutletID);
      this.IngCompanyRequest = this.IngCompaniesForm.value;
      this.API.PostData('/Ingredient/AddEditIngredientCompany', this.IngCompanyRequest).subscribe(c => {
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
          this.getCompanies();
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

  getCompanies() {
    this.API.getdata('/Ingredient/getIngredientCompany?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.IngCompanyResponse = c.responseIngredientCompany;
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

  editIngComp(p: any) {
    this.addMode = false;
    this.isShow = !this.isShow;
    this.IngCompaniesForm.controls.ingredientCompanyID.patchValue(p.ingredientCompanyID);
    this.IngCompaniesForm.controls.ingredientCompanyName.patchValue(p.ingredientCompanyName);
    this.IngCompaniesForm.controls.isActive.patchValue(p.isActive);
    this.IngCompaniesForm.controls.outletID.patchValue(p.outletID);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.IngCompaniesForm.controls.isActive.setValue(true);
    } else {
      this.IngCompaniesForm.controls.isActive.setValue(false);
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