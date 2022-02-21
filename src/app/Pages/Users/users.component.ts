import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { of, Subject } from 'rxjs';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { UserModelResponse, OutletResponseModel, UserModelRequest, MenuResponse, getOutletRequest } from './UsersModel';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  validForm: boolean = false;
  WillLogin: boolean = false;
  AllSelect: boolean = false;
  MenuScreens: boolean = false;
  addMode: boolean = false;
  submitted: boolean = false;
  passMatch: boolean = false;
  isShow: boolean = false;

  MenuResponseArrOne: { assignMenuID: number, menuName: string, isActive: boolean, selected: boolean }[] = [];
  MenuResponseArrTwo: { assignMenuID: number, menuName: string, isActive: boolean, selected: boolean }[] = [];
  getOutletRequest: getOutletRequest;
  UserModelResponse: UserModelResponse[];
  UserModelRequest: UserModelRequest;
  MenuResponse: MenuResponse[];
  OutletResponseModel: OutletResponseModel[];
  OutletResponseModelOne: OutletResponseModel[];
  OutletResponseModelTwo: OutletResponseModel[];

  dropdownSettings: IDropdownSettings = {};

  UserForm: FormGroup;
  @ViewChildren(DataTableDirective)
  datatableElement: QueryList<DataTableDirective>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private API: ApiService,
    public GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.MenuResponse = [];
    this.OutletResponseModel = [];
    this.OutletResponseModelOne = [];
    this.OutletResponseModelTwo = [];
    this.UserModelResponse = [];
    this.UserModelRequest = new UserModelRequest();
    this.getOutletRequest = new getOutletRequest();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'GroupId',
      textField: 'GroupName',
      selectAllText: 'Select All Groups',
      unSelectAllText: 'UnSelect All Groups',
      itemsShowLimit: 7,
      allowSearchFilter: true
    }

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  ngOnInit(): void {
    this.GV.companyID = Number(localStorage.getItem('companyID'));
    this.GV.isOwner = Number(localStorage.getItem('isOwner'));
    this.GV.userID = Number(localStorage.getItem('userID'));
    this.InitializeForm();
    this.getUsers();
    this.getOutlets();
    this.getMenu();
  }

  InitializeForm() {
    this.UserForm = new FormGroup({
      userID: new FormControl(""),
      Name: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      MobileNo: new FormControl("", [Validators.required, Validators.pattern(".{11,11}")]),
      Gender: new FormControl("", [Validators.required]),
      Designation: new FormControl("", [Validators.required]),
      Email: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      Password: new FormControl(""),
      confirmPassword: new FormControl(""),
      isActive: new FormControl(""),
      willLogin: new FormControl(""),
      ownerId: new FormControl(""),
      Address: new FormControl(""),
      Cnic: new FormControl('', [
        Validators.pattern("^[0-9]{13}$")]),
      DOB: new FormControl(""),
      companyID: new FormControl(""),
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.UserForm.controls; }

  getMenu() {
    this.API.getdata('/Generic/getAssignMenu').subscribe(c => {
      if (c != null) {
        this.MenuResponse = c.responseAssigns;
        this.MenuResponse.forEach((c) => c.selected = false);
        this.divideMenu();
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  divideMenu() {
    this.MenuResponseArrOne = [];
    this.MenuResponseArrTwo = [];
    if (this.MenuResponse.length == 1) {
      this.MenuResponseArrOne = this.MenuResponse;
      this.MenuResponseArrTwo = [];
    }
    else if (this.MenuResponse.length > 1 && this.MenuResponse.length % 2 == 0) {
      var half = this.MenuResponse.length / 2;
      for (let i = 0; i < this.MenuResponse.length; i++) {
        if (i < half) {
          this.MenuResponseArrOne.push(this.MenuResponse[i]);
        }
        else {
          this.MenuResponseArrTwo.push(this.MenuResponse[i]);
        }
      }
    }
    else if (this.MenuResponse.length > 1 && Math.abs(this.MenuResponse.length % 2) == 1) {
      var half = this.MenuResponse.length / 2;
      half = Math.ceil(half);
      for (let i = 0; i < this.MenuResponse.length; i++) {
        if (i < half) {
          this.MenuResponseArrOne.push(this.MenuResponse[i]);
        }
        else {
          this.MenuResponseArrTwo.push(this.MenuResponse[i]);
        }
      }
    }
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
        this.OutletResponseModel.forEach((c) => c.selected = false);
        this.divideOutlets();
        this.getOutletRequest = new getOutletRequest();
      }
    },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }
  divideOutlets() {
    this.OutletResponseModelOne = [];
    this.OutletResponseModelTwo = [];
    if (this.OutletResponseModel.length == 1) {
      this.OutletResponseModelOne = this.OutletResponseModel;
      this.OutletResponseModelTwo = [];
    }
    else if (this.OutletResponseModel.length > 1 && this.OutletResponseModel.length % 2 == 0) {
      var half = this.OutletResponseModel.length / 2;
      for (let i = 0; i < this.OutletResponseModel.length; i++) {
        if (i < half) {
          this.OutletResponseModelOne.push(this.OutletResponseModel[i]);
        }
        else {
          this.OutletResponseModelTwo.push(this.OutletResponseModel[i]);
        }
      }
    }
    else if (this.OutletResponseModel.length > 1 && Math.abs(this.OutletResponseModel.length % 2) == 1) {
      var half = this.OutletResponseModel.length / 2;
      half = Math.ceil(half);
      for (let i = 0; i < this.OutletResponseModel.length; i++) {
        if (i < half) {
          this.OutletResponseModelOne.push(this.OutletResponseModel[i]);
        }
        else {
          this.OutletResponseModelTwo.push(this.OutletResponseModel[i]);
        }
      }
    }
  }


  outletSelected(check: any, p: any) {
    if (check == true) {
      var index = this.OutletResponseModel.findIndex((c) => c.outletID == p.outletID);
      this.OutletResponseModel[index].selected = true;
      let body = {
        outletID: this.OutletResponseModel[index].outletID,
      }
      this.UserModelRequest.requestAssignOutlet.push(body);
      this.divideOutlets();
    }
    else {
      var index = this.OutletResponseModel.findIndex((c) => c.outletID == p.outletID);
      this.OutletResponseModel[index].selected = false;
      var ind = this.UserModelRequest.requestAssignOutlet.findIndex((c) => c.outletID == p.outletID);
      this.UserModelRequest.requestAssignOutlet.splice(ind, 1);
      this.divideOutlets();
    }
  }
  menuSelected(check: any, p: any) {
    if (check == true && p == "All") {
      this.UserModelRequest.requestUserMenu = [];
      this.MenuResponse.forEach((c: any) => {
        c.selected = true;
      });
      this.MenuResponse.forEach((c: any) => {
        let body = {
          assignMenuID: c.assignMenuID
        }
        this.UserModelRequest.requestUserMenu.push(body);
      });
      this.divideMenu();
    }
    else if (check == false && p == "All") {
      this.UserModelRequest.requestUserMenu = [];
      this.MenuResponse.forEach((c: any) => {
        c.selected = false;
      });
      this.divideMenu();
    }
    else if (check == true && p != "All") {
      var index = this.MenuResponse.findIndex((c: any) => c.assignMenuID == p.assignMenuID);
      let body = {
        assignMenuID: this.MenuResponse[index].assignMenuID
      }
      this.UserModelRequest.requestUserMenu.push(body);
      this.MenuResponse[index].selected = true;
      this.divideMenu();
    }
    else {
      var index = this.UserModelRequest.requestUserMenu.findIndex((c: any) => c.assignMenuID == p.assignMenuID);
      this.UserModelRequest.requestUserMenu.splice(index, 1);
      var ind = this.MenuResponse.findIndex((c: any) => c.assignMenuID == p.assignMenuID);
      this.MenuResponse[ind].selected = false;
      this.divideMenu();
    }
    this.verifySelectAll();
  }
  passVerify() {
    if (this.UserForm.controls.Password.value === this.UserForm.controls.confirmPassword.value) {
      this.passMatch = true;
    }
    else {
      this.passMatch = false;
    }
  }
  addNewUser() {
    this.submitted = false;
    this.UserForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }

  setDesignation() {
    if (this.UserForm.controls.Designation.value == "Select Designation") {
      this.UserForm.controls.Designation.setValue("");
    }
  }


  getUsers() {
    this.API.getdata('/Outlet/getUser?companyID=' + this.GV.companyID).subscribe(c => {
      if (c != null) {
        this.destroyDT(0, false).then(destroyed => {
          this.UserModelResponse = c.responseUser;
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

  editUser(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.UserForm.patchValue(p);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.UserForm.controls.isActive.setValue(true);
    } else {
      this.UserForm.controls.isActive.setValue(false);
    }
  }

  verifySelectAll() {
    if (this.UserModelRequest.requestUserMenu.length == this.MenuResponse.length) {
      this.AllSelect = true;
    }
    else {
      this.AllSelect = false;
    }
  }

  seeInput(canLogin: any) {
    if (canLogin == "Yes") {
      this.WillLogin = true;
      this.UserForm.controls.willLogin.setValue(true);
    }
    else {
      this.WillLogin = false;
      this.UserForm.controls.willLogin.setValue(false);
      this.UserModelRequest.requestUserMenu = [];
      this.MenuResponse.forEach((c: any) => {
        c.selected = false;
      });
      this.divideMenu();
      this.AllSelect = false;
      this.UserForm.controls.Password.reset();
      this.UserForm.controls.confirmPassword.reset();
    }
  }
  validations() {
    if (this.WillLogin == true) {
      if ((this.UserForm.controls.Password.value == "" || this.UserForm.controls.Password.value == null) && (this.UserForm.controls.confirmPassword.value == "" || this.UserForm.controls.confirmPassword.value == null)) {
        this.toastr.warning('Enter Password & Confirm Password', '', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.validForm = false;
        return
      }
      else if (this.UserForm.controls.Password.value != this.UserForm.controls.confirmPassword.value) {
        this.toastr.warning('Password & Confirm Password do not match!', '', {
          timeOut: 3000,
          'progressBar': true,
        });
        this.validForm = false;
        return
      }
      else {
        this.validForm = true;
      }
      // if (this.UserModelRequest.requestUserMenu.length == 0) {
      //   this.toastr.warning('Select atleast one Menu Screen', '', {
      //     timeOut: 3000,
      //     'progressBar': true,
      //   });
      //   this.MenuScreens = false;
      //   return
      // }
      // else {
      //   this.MenuScreens = true;
      // }
    }
    this.validForm = true;
    this.MenuScreens = true;
  }
  saveUser() {
    if (this.UserForm.controls.willLogin.value == "" || this.UserForm.controls.willLogin.value == null) {
      this.UserForm.controls.willLogin.setValue(true);
    }
    this.submitted = true;
    if (this.UserForm.valid) {
      if (this.UserModelRequest.requestAssignOutlet.length == 0) {
        this.toastr.warning('Select atleast one outlet', '', {
          timeOut: 3000,
          'progressBar': true,
        });
        return
      }
      this.validations();
      if (this.validForm == true && this.MenuScreens == true) {
        if (this.UserForm.controls.userID.value == "" || this.UserForm.controls.userID.value == null) {
          this.UserForm.controls.userID.setValue(0);
        }
        if (this.UserForm.controls.isActive.value == "" || this.UserForm.controls.isActive.value == null) {
          this.UserForm.controls.isActive.setValue(false);
        }

        this.UserForm.controls.ownerId.setValue(this.GV.ownerID);
        this.UserForm.controls.companyID.setValue(this.GV.companyID);
        this.UserModelRequest.requestUser = this.UserForm.value;
        this.API.PostData('/Outlet/AddEditUser', this.UserModelRequest).subscribe(c => {
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
            this.getUsers();
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
  }
  resetAll() {
    this.UserForm.reset();
    this.UserModelRequest = new UserModelRequest();
    this.MenuResponse.forEach((c: any) => {
      c.selected = false;
    });
    this.OutletResponseModel.forEach((c: any) => {
      c.selected = false;
    });
    this.divideMenu();
    this.divideOutlets();
    this.AllSelect = false;
    this.passMatch = false;
    this.validForm = false;
    this.submitted = false;
    this.MenuScreens = false;
    this.WillLogin = false;
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
