import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { taxesRequestModel, taxesResponseModel } from './taxesModel';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  taxesRequestModel: taxesRequestModel;
  taxesResponseModel: taxesResponseModel[];
  addMode: boolean = false;
  submitted: boolean = false;
  TaxForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.taxesResponseModel = [];
    this.taxesRequestModel = new taxesRequestModel();

  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getTaxes();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  InitializeForm() {
    this.TaxForm = new FormGroup({
      taxID: new FormControl(""),
      taxName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      taxRate: new FormControl("", [Validators.required]),
      isActive: new FormControl(""),
      outletID: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.TaxForm.controls; }

  addTax() {
    this.submitted = false;
    this.TaxForm.reset();
    this.isShow = !this.isShow;
    this.addMode = true;
    this.TaxForm.controls.isActive.setValue(true);
  }

  saveTaxInfo() {
    this.submitted = true;
    if (this.TaxForm.valid) {
      if (this.TaxForm.controls.taxID.value == "" || this.TaxForm.controls.taxID.value == null) {
        this.TaxForm.controls.taxID.setValue(0);
      }
      this.TaxForm.controls.outletID.setValue(this.GV.OutletID);
      this.taxesRequestModel = this.TaxForm.value;
      this.API.PostData('/Generic/AddEditTax', this.taxesRequestModel).subscribe(c => {
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
          this.getTaxes();
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

  getTaxes() {
    this.API.getdata('/Generic/getTax?OutletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.taxesResponseModel = c.responseTax;
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

  editTax(p: any) {
    this.addMode = false;
    this.isShow = !this.isShow;
    this.TaxForm.patchValue(p);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.TaxForm.controls.isActive.setValue(true);
    } else {
      this.TaxForm.controls.isActive.setValue(false);
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