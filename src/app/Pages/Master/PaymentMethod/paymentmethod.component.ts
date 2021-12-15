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
  requestPaymentModel: requestPaymentModel;
  responsePaymentModel: responsePaymentModel[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
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

  }
  addNewPayment() {
    this.submitted = false;
    this.PaymentForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }
  InitializeForm() {
    this.PaymentForm = new FormGroup({
      paymentName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      isActive: new FormControl(""),
      outletID: new FormControl(""),
      OwnerID: new FormControl(""),
      paymentID: new FormControl(""),
      description: new FormControl(""),
      taxPercentage: new FormControl(""),
      serviceChargePercentage: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.outletID = this.GV.OutletID;
    this.InitializeForm();
    this.getPayments();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
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
      this.PaymentForm.controls.OwnerID.setValue(this.GV.ownerID);
    }
    this.submitted = true;
    if (this.PaymentForm.valid) {
      if (this.PaymentForm.controls.isActive.value == "" || this.PaymentForm.controls.isActive.value == null) {
        this.PaymentForm.controls.isActive.setValue(false);
      }
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
        this.responsePaymentModel = c.responsePayments;
        this.dtTrigger.next();
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
}
