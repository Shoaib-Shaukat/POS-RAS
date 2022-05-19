import { Component, OnInit, QueryList, ViewChildren, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { requestCity, requestStRegions, responseCity, responseCountries, responseRegions, VendorModelRequest, VendorModelResponse } from './VendorModel';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css']
})
export class VendorsComponent implements OnInit {
  responseRegions: responseRegions[];
  responseCountries: responseCountries[];
  responseCity: responseCity[];
  requestCity: requestCity;
  requestStRegions: requestStRegions;
  selectedRegion: number;
  selectedCountry: number;
  addMode: boolean = false;
  submitted: boolean = false;
  VendorForm: FormGroup;
  isShow: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  VendorModelRequest: VendorModelRequest;
  VendorModelResponse: VendorModelResponse[];

  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.VendorModelRequest = new VendorModelRequest();
    this.VendorModelResponse = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.responseCountries = [];
    this.requestCity = new requestCity();
    this.requestStRegions = new requestStRegions();
    this.responseCity = [];
    this.responseCountries = [];
    this.responseRegions = [];
  }
  addVendor() {
    this.submitted = false;
    this.VendorForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.VendorForm.controls.isActive.setValue(true);
  }
  InitializeForm() {
    this.VendorForm = new FormGroup({
      vendorID: new FormControl(""),
      vendorName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      vendorAddress: new FormControl(""),
      cityID: new FormControl(""),
      stateID: new FormControl(""),
      postalCode: new FormControl(""),
      countryID: new FormControl(""),
      phoneNo: new FormControl("", [Validators.pattern(".{10,10}")]),
      mobileNo: new FormControl("", [Validators.pattern(".{11,11}")]),
      faxNo: new FormControl(""),
      email: new FormControl(""),
      isActive: new FormControl(""),
      userID: new FormControl(""),
      outletID: new FormControl(""),
    });
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getVendors();
    this.getCountries();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.VendorForm.controls; }

  saveVendor() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.submitted = true;
    if (this.VendorForm.valid) {
      if (!this.VendorForm.controls.phoneNo.value && !this.VendorForm.controls.mobileNo.value) {
        this.toastr.error('Enter Phone or Mobile No.', '', {
          timeOut: 3000,
          'progressBar': true,
        });
        return
      }
      if (this.VendorForm.controls.vendorID.value == "" || this.VendorForm.controls.vendorID.value == null) {
        this.VendorForm.controls.vendorID.setValue(0);
      }
      this.VendorForm.controls.userID.setValue(this.GV.userID);
      this.VendorForm.controls.outletID.setValue(this.GV.OutletID);
      this.VendorModelRequest = this.VendorForm.value;
      this.API.PostData('/FoodMenu/AddEditVendor', this.VendorModelRequest).subscribe(c => {
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
          this.getVendors();
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
      this.VendorForm.controls.isActive.setValue(true);
    } else {
      this.VendorForm.controls.isActive.setValue(false);
    }
  }
  getVendors() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getVendor?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.VendorModelResponse = c.responseVendor;
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

  editVendor(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.VendorForm.patchValue(p);
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
  getCountries() {
    this.API.getdata('/Generic/getCountries').subscribe(c => {
      if (c != null) {
        this.responseCountries = c.responseCountries;
      }
    },
      error => {
        this.toastr.error(error.statusText, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getCities() {
    this.requestCity.RegionId = this.selectedRegion;
    this.API.PostData('/Generic/getCities', this.requestCity).subscribe(c => {
      if (c != null) {
        this.responseCity = c;
        if (this.VendorForm.controls.countryID.value == 167) {
          this.VendorForm.controls.cityID.setValue(85521);
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

  getRegions() {
    this.requestStRegions.CountryId = this.selectedCountry;
    this.API.getdata('/Generic/getRegions?CountryId=' + this.requestStRegions.CountryId).subscribe(c => {
      if (c != null) {
        this.responseRegions = c.requestStRegions;
        if (this.VendorForm.controls.countryID.value == 167) {
          this.VendorForm.controls.stateID.setValue(3175);
          this.changeRegion(this.VendorForm.controls.stateID.value);
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
  changeRegion(event: any) {
    this.selectedRegion = event;
    this.responseCity = [];
    this.getCities();
  }
  changeCountry() {
    this.selectedCountry = Number(this.VendorForm.controls.countryID.value);
    this.responseRegions = [];
    this.responseCity = [];
    this.getRegions();
  }
}