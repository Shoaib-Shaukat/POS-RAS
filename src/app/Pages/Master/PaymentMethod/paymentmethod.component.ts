import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestPaymentModel, responsePaymentModel } from './paymentModel';

@Component({
  selector: 'app-paymentmethod',
  templateUrl: './paymentmethod.component.html',
  styleUrls: ['./paymentmethod.component.css']
})
export class PaymentmethodComponent implements OnInit {
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  requestPaymentModel: requestPaymentModel;
  responsePaymentModel: responsePaymentModel[];
  addMode: boolean = false;
  submitted: boolean = false;
  PaymentForm: FormGroup;
  isShow: boolean = false;
  outletID: number;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.responsePaymentModel = [];
    this.requestPaymentModel = new requestPaymentModel();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

  }
  addNewPayment() {
    this.submitted = false;
    this.PaymentForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.PaymentForm.controls.isActive.setValue(true);
  }
  InitializeForm() {
    this.PaymentForm = new FormGroup({
      paymentName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      outletID: new FormControl(""),
      UserID: new FormControl(""),
      paymentID: new FormControl(""),
      description: new FormControl(""),
      taxPercentage: new FormControl("", [Validators.max(100), Validators.min(0)]),
      serviceChargePercentage: new FormControl("", [Validators.max(100), Validators.min(0)]),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.outletID = this.GV.OutletID;
    this.InitializeForm();
    this.getPayments();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.PaymentForm.controls; }

  savePaymentInfo() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    else {
      this.PaymentForm.controls.outletID.setValue(this.GV.OutletID);
      this.PaymentForm.controls.UserID.setValue(this.GV.userID);
    }
    this.submitted = true;
    if (this.PaymentForm.valid) {
      if (this.PaymentForm.controls.paymentID.value == "" || this.PaymentForm.controls.paymentID.value == null) {
        this.PaymentForm.controls.paymentID.setValue(0);
      }
      this.requestPaymentModel = this.PaymentForm.value;
      this.API.PostData('/FoodMenu/AddEditPayment', this.requestPaymentModel).subscribe(c => {
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
          this.getPayments();
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

  getPayments() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getPayment?outletID=' + this.outletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.responsePaymentModel = c.responsePayments;
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.PaymentForm.controls.isActive.setValue(true);
    } else {
      this.PaymentForm.controls.isActive.setValue(false);
    }
  }

  editPaymentInfo(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.PaymentForm.patchValue(p);
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
