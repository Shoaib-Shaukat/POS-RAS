import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from '../../../Services/Globel/gvar.service'
import { getOutletRequest, requestOutletModel, OutletResponseModel, responsePrinter, requestOutlet, invoiceTypesResponse, paymentTypesResponse } from './Outlet.Model';
import { Router } from '@angular/router';
import { CurrencyModelResponse } from '../Currency/currencyModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.css'],
})
export class OutletComponent implements OnInit {
  invoiceTypesResponse: invoiceTypesResponse[];
  paymentTypesResponse: paymentTypesResponse[];
  responsePrinter: responsePrinter[];
  fileToUpload: any = null;
  imageUrl: string;
  requestOutlet: requestOutlet;
  getOutletRequest: getOutletRequest;
  OutletResponseModel: OutletResponseModel[];
  CurrencyModelResponse: CurrencyModelResponse[];
  isShow = false;
  OutletForm: FormGroup;
  PrinterForm: FormGroup;
  submitted: boolean = false;
  addMode: boolean = false;

  constructor(public GV: GvarService, public API: ApiService, private toastr: ToastrService, private router: Router) {
    this.OutletForm = new FormGroup({});
    this.getOutletRequest = new getOutletRequest();
    this.OutletResponseModel = [];
    this.CurrencyModelResponse = [];
    this.responsePrinter = [];
    this.requestOutlet = new requestOutlet();
    this.invoiceTypesResponse = [];
    this.paymentTypesResponse = [];
  }

  ngOnInit(): void {
    this.GV.SetOutlet(null);
    localStorage.setItem('OutletName', '');
    Number(localStorage.setItem('outletID', '0'));
    this.GV.OutletID = 0;
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    if (localStorage.getItem('isOwner') == "false") {
      this.GV.isOwner = false;
    }
    else {
      this.GV.isOwner = true;
    }
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletName = "";
    this.submitted = false;
    this.IntializeForm();
    this.getOutlets();
    this.getCurrencies();
    this.getInvoiceandPaymentModeTypes();
    localStorage.setItem('openingDate', '');
    this.GV.setOpeningDate(null);
  }

  IntializeForm() {
    this.OutletForm = new FormGroup({
      outletID: new FormControl(""),
      outletName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      phone: new FormControl("", [Validators.required, Validators.pattern(".{10,10}")]),
      email: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      address: new FormControl("", [Validators.required]),
      hasKitchen: new FormControl(""),
      isActive: new FormControl(""),
      companyID: new FormControl(""),
      UserID: new FormControl(""),
      currencyID: new FormControl("", [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      invoiceFormat: new FormControl(""),
      billFormat: new FormControl(""),
      kotFormat: new FormControl(""),
      outletLogo: new FormControl(""),
      serviceCharges: new FormControl(""),
      takeawayCharges: new FormControl(""),
      deliveryCharges: new FormControl(""),
      deliveryChargesPer: new FormControl(""),
      takeawayChargesPer: new FormControl(""),
      serviceChargesPer: new FormControl(""),
      posID: new FormControl("", [Validators.required]),
      usinNumber: new FormControl(""),
      pctCode: new FormControl(""),
      invoiceTypeID: new FormControl(),
      paymentModeID: new FormControl(),
      endPoint: new FormControl(),
      posFee: new FormControl(),
      taxOffice: new FormControl(),
      outletNTNNumber: new FormControl(),
      outletSTRNumber: new FormControl()
    });
    this.PrinterForm = new FormGroup({
      printerID: new FormControl(""),
      printerIP: new FormControl(""),
      printerPort: new FormControl(""),
      printerTitle: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      outletID: new FormControl(""),
      isActive: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  get f() { return this.OutletForm.controls; }

  addNewOutlet() {
    this.submitted = false;
    this.OutletForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.OutletForm.controls.currencyID.setValue(0);
    this.OutletForm.controls.invoiceFormat.setValue(1);
    this.OutletForm.controls.billFormat.setValue(1);
    this.OutletForm.controls.kotFormat.setValue(1);
    this.OutletForm.controls.isActive.setValue(true);
    this.OutletForm.controls.serviceCharges.setValue(0);
    this.OutletForm.controls.takeawayCharges.setValue(0);
    this.OutletForm.controls.deliveryCharges.setValue(0);
    this.OutletForm.controls.serviceChargesPer.setValue(0);
    this.OutletForm.controls.takeawayChargesPer.setValue(0);
    this.OutletForm.controls.deliveryChargesPer.setValue(0);
    this.OutletForm.controls.usinNumber.setValue("001897");
    this.OutletForm.controls.pctCode.setValue("01011000");
    this.OutletForm.controls.invoiceTypeID.setValue(0);
    this.OutletForm.controls.paymentModeID.setValue(1);
    this.OutletForm.controls.endPoint.setValue('http://localhost:8524/api/IMSFiscal/GetInvoiceNumberByModel');
  }

  getOutlets() {
    if (this.GV.companyID == 0) {
      this.toastr.warning('Select Company First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.getOutletRequest.CompanyID = this.GV.companyID;
    this.getOutletRequest.UserID = this.GV.userID;
    this.API.PostData('/Outlet/getOutlet', this.getOutletRequest).subscribe(c => {
      if (c != null) {
        this.OutletResponseModel = c.responseOutlet;
        this.OutletResponseModel.forEach((x) => {
          var randomColor = '#' + Math.floor(Math.random() * 19777215).toString(16);
          x.color = randomColor
        })
        //this.OutletResponseModel = this.OutletResponseModel.filter(f => this.AllOutlets.some((item: any) => item.outletID === f.outletID));
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  onOutletsubmit() {
    this.submitted = true;
    if (this.OutletForm.valid) {
      if (this.OutletForm.controls.hasKitchen.value == "" || this.OutletForm.controls.hasKitchen.value == null) {
        this.OutletForm.controls.hasKitchen.setValue(false);
      }
      if (this.OutletForm.controls.outletID.value == null) {
        this.OutletForm.controls.outletID.setValue(0);
      }
      if (this.OutletForm.controls.serviceCharges.value == null || this.OutletForm.controls.serviceCharges.value == "") {
        this.OutletForm.controls.serviceCharges.setValue(0);
      }
      if (this.OutletForm.controls.takeawayCharges.value == null || this.OutletForm.controls.takeawayCharges.value == "") {
        this.OutletForm.controls.takeawayCharges.setValue(0);
      }
      if (this.OutletForm.controls.deliveryCharges.value == null || this.OutletForm.controls.deliveryCharges.value == "") {
        this.OutletForm.controls.deliveryCharges.setValue(0);
      }

      this.OutletForm.controls.UserID.setValue(this.GV.userID);
      this.OutletForm.controls.companyID.setValue((Number(localStorage.getItem('companyID'))));
      this.OutletForm.controls.currencyID.setValue((Number(this.OutletForm.controls.currencyID.value)));
      if (this.OutletForm.controls.paymentModeID.value) {
        this.OutletForm.controls.paymentModeID.setValue(+(this.OutletForm.controls.paymentModeID.value));
      }
      if (this.OutletForm.controls.invoiceTypeID.value) {
        this.OutletForm.controls.invoiceTypeID.setValue(+(this.OutletForm.controls.invoiceTypeID.value));
      }
      this.requestOutlet = this.OutletForm.value;
      if (this.imageUrl == null || this.imageUrl == "" || this.imageUrl == undefined) {
        this.imageUrl = ""
      }
      else {
        this.requestOutlet.outletLogo = this.imageUrl;
      }
      this.API.PostData('/Outlet/AddEditOutlet', this.requestOutlet).subscribe(c => {
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
          this.getOutlets();
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

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.OutletForm.controls.isActive.setValue(true);
    } else {
      this.OutletForm.controls.isActive.setValue(false);
    }
  }
  hasKitchenChange(kitchen: boolean) {
    if (kitchen == true) {
      this.OutletForm.controls.hasKitchen.setValue(true);
    } else {
      this.OutletForm.controls.hasKitchen.setValue(false);
    }
  }

  enterInOutlet(p: any) {
    this.GV.OutletInfo = p;
    this.GV.SetOutlet(p.outletName);
    localStorage.setItem('OutletInfo', JSON.stringify(p));
    localStorage.setItem('OutletName', p.outletName);
    localStorage.setItem('outletID', p.outletID);
    this.GV.OutletID = p.outletID;
    var index = this.CurrencyModelResponse.findIndex((x) => x.currencyID == p.currencyID);
    this.GV.Currency = this.CurrencyModelResponse[index].symbol;
    this.GV.OutletName = p.outletName;
    this.GV.OutletAddress = p.address;
    this.setOpeningDate();
    if (p.outletID == undefined) {
      this.GV.OutletID = 0;
    }
    if (this.GV.OutletID > 0) {
      this.router.navigate(['/Dashboard']);
    }
  }

  setOpeningDate() {
    this.API.getdata('/Generic/getOpenday?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        if (c.message == "Data not found") {
          this.GV.setOpeningDate(null);
          localStorage.setItem('openingDate', '');
        }
        else {
          this.GV.setOpeningDate(c.openingDate);
          localStorage.setItem('openingDate', c.openingDate);
        }
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  editOutlet(p: any) {
    this.requestOutlet = new requestOutlet();
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.OutletForm.patchValue(p);

  }

  getCurrencies() {
    this.API.getdata('/Generic/getCurrency?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.CurrencyModelResponse = c.responseCurrencies;
        let body: any = {
          currencyID: 0,
          currencyName: 'Select Currency'
        }
        this.CurrencyModelResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  attachImage(file: any) {
    if (!file.target.files)
      return;
    this.fileToUpload = file.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  chargesInfoChanged(val: any, inputField: any) {
    if (val == 1 && inputField == 1) {
      this.OutletForm.controls.serviceChargesPer.setValue(0);
    }
    else if (val == 1 && inputField == 2) {
      this.OutletForm.controls.takeawayChargesPer.setValue(0);
    }
    else if (val == 1 && inputField == 3) {
      this.OutletForm.controls.deliveryChargesPer.setValue(0);
    }
    else if (val == 2 && inputField == 1) {
      this.OutletForm.controls.serviceCharges.setValue(0);
    }
    else if (val == 2 && inputField == 2) {
      this.OutletForm.controls.takeawayCharges.setValue(0);
    }
    else {
      this.OutletForm.controls.deliveryCharges.setValue(0);
    }
  }

  getInvoiceandPaymentModeTypes() {
    this.API.getdata('/Generic/getInvoiceType').subscribe(c => {
      if (c != null) {
        this.invoiceTypesResponse = c.responseInvoiceType;
        let body = {
          invoiceTypeID: 0,
          invoiceTypeName: "Select Invoice Type"
        }
        this.invoiceTypesResponse.push(body);
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });

    this.API.getdata('/Generic/getPaymentMode').subscribe(c => {
      if (c != null) {
        this.paymentTypesResponse = c.responsePaymentMode;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
}
