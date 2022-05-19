import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { LocationModelRequest, LocationModelResponse } from './LocationModel';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  addMode: boolean = false;
  submitted: boolean = false;
  LocationForm: FormGroup;
  isShow: boolean = false;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  LocationModelRequest: LocationModelRequest;
  LocationModelResponse: LocationModelResponse[];

  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.LocationModelRequest = new LocationModelRequest();
    this.LocationModelResponse = [];
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }
  ngOnInit(): void {
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.GV.OutletID = Number(localStorage.getItem('outletID'));
    this.InitializeForm();
    this.getLocations();
  }

  InitializeForm() {
    this.LocationForm = new FormGroup({
      locationID: new FormControl(""),
      locationName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      userID: new FormControl(""),
      outletID: new FormControl(""),
      isActive: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  addLocation() {
    this.submitted = false;
    this.LocationForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
    this.LocationForm.controls.isActive.setValue(true);
  }

  get f() { return this.LocationForm.controls; }

  saveLocation() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.submitted = true;
    if (this.LocationForm.valid) {
      if (this.LocationForm.controls.locationID.value == "" || this.LocationForm.controls.locationID.value == null) {
        this.LocationForm.controls.locationID.setValue(0);
      }
      this.LocationForm.controls.userID.setValue(this.GV.userID);
      this.LocationForm.controls.outletID.setValue(this.GV.OutletID);
      this.LocationModelRequest = this.LocationForm.value;
      this.API.PostData('/FoodMenu/AddEditLocation', this.LocationModelRequest).subscribe(c => {
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
          this.getLocations();
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
      this.LocationForm.controls.isActive.setValue(true);
    } else {
      this.LocationForm.controls.isActive.setValue(false);
    }
  }
  getLocations() {
    if (this.GV.OutletID == 0) {
      this.toastr.warning('Select Outlet First', '', {
        timeOut: 3000,
        'progressBar': true,
      });
      return;
    }
    this.API.getdata('/FoodMenu/getLocation?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.LocationModelResponse = c.responseLocation;
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

  editLocations(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.LocationForm.patchValue(p);
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
