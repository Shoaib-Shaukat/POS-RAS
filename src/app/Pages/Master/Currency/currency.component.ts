import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { CurrencyModelRequest, CurrencyModelResponse } from './currencyModel';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  CurrencyModelRequest: CurrencyModelRequest;
  CurrencyModelResponse: CurrencyModelResponse[];

  addMode: boolean = false;
  submitted: boolean = false;
  CurrencyForm: FormGroup;
  isShow: boolean = false;

  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.CurrencyModelResponse = [];
    this.CurrencyModelRequest = new CurrencyModelRequest();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  addNewCurrency() {
    this.submitted = false;
    this.CurrencyForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }
  InitializeForm() {
    this.CurrencyForm = new FormGroup({
      currencyID: new FormControl(""),
      currencyName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      symbol: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      UserID: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.InitializeForm();
    this.getCurrencies();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.CurrencyForm.controls; }

  savePaymentInfo() {
    this.submitted = true;
    if (this.CurrencyForm.valid) {
      if (this.CurrencyForm.controls.currencyID.value == "" || this.CurrencyForm.controls.currencyID.value == null) {
        this.CurrencyForm.controls.currencyID.setValue(0);
      }
      this.CurrencyForm.controls.UserID.setValue(this.GV.userID);
      this.CurrencyModelRequest = this.CurrencyForm.value;
      this.API.PostData('/Generic/AddEditCurrency', this.CurrencyModelRequest).subscribe(c => {
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
          this.getCurrencies();
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

  getCurrencies() {
    this.API.getdata('/Generic/getCurrency?userID=' + this.GV.userID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.CurrencyModelResponse = c.responseCurrencies;
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

  editCurrencyInfo(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.CurrencyForm.patchValue(p);
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
