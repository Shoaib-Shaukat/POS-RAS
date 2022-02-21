import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { count } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/API/api.service';
import { GvarService } from 'src/app/Services/Globel/gvar.service';
import { GroupRequestModel, GroupRoles, RoleAssignModel, StaffModelRequest, StaffModelResponse, UserGroupRolesModel } from './staffModel';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  @ViewChildren("closeAssignRoleModal") closeAssignRoleModal: any;
  assignModel: RoleAssignModel;
  public assignGroupsModel: GroupRequestModel = new GroupRequestModel();
  public groupAssignedRoleList: Array<UserGroupRolesModel> = new Array<UserGroupRolesModel>();
  GroupResponseModel: GroupRoles[];
  staffName: string = "";
  allRoles: string[] = ["POS", "Kitchen", "Orders", "Menu", "Deals"];
  dropdownSettings: IDropdownSettings = {};
  selectedRoles = [];
  StaffModelRequest: StaffModelRequest;
  StaffModelResponse: StaffModelResponse[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  addMode: boolean = false;
  submitted: boolean = false;
  StaffForm: FormGroup;
  isShow: boolean = false;
  constructor(private API: ApiService,
    private GV: GvarService,
    public toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router) {
    this.selectedRoles = [];
    this.GroupResponseModel = [];
    this.assignModel = new RoleAssignModel();
    this.assignGroupsModel = new GroupRequestModel();

    this.StaffModelResponse = [];
    this.StaffModelRequest = new StaffModelRequest();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'GroupId',
      textField: 'GroupName',
      selectAllText: 'Select All Groups',
      unSelectAllText: 'UnSelect All Groups',
      itemsShowLimit: 7,
      allowSearchFilter: true
    }
  }

  ngOnInit(): void {
    this.InitializeForm();
    //this.getAllRoles();
    this.getStaff();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  InitializeForm() {
    this.StaffForm = new FormGroup({
      staffID: new FormControl(""),
      staffName: new FormControl("", [Validators.required, this.noWhitespaceValidator]),
      staffMobileNo: new FormControl("", [
        Validators.required,
        Validators.pattern(".{11,11}")]),
      staffEmail: new FormControl("", [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      staffPassword: new FormControl("", [Validators.required]),
      staffDesignation: new FormControl("", [Validators.required]),
      staffAddress: new FormControl(""),
      isActive: new FormControl(""),
      outletID: new FormControl(""),
      OwnerID: new FormControl("")
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.StaffForm.controls; }

  addNewStaff() {
    this.submitted = false;
    this.StaffForm.reset();
    this.isShow = !this.isShow;
    this.addMode = false;
  }

  getAllRoles() {
    this.API.getdata('/ManageGroup/GetGroupList').subscribe(
      data => {
        if (data != null) {
          this.allRoles = data;
        }
        else {
        }
      },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  setDesignation() {
    if (this.StaffForm.controls.staffDesignation.value == "Select Designation") {
      this.StaffForm.controls.staffDesignation.setValue("");
    }
  }

  saveStaff() {
    this.submitted = true;
    if (this.StaffForm.valid) {
      if (this.StaffForm.controls.staffID.value == "" || this.StaffForm.controls.staffID.value == null) {
        this.StaffForm.controls.staffID.setValue(0);
      }
      if (this.StaffForm.controls.isActive.value == "" || this.StaffForm.controls.isActive.value == null) {
        this.StaffForm.controls.isActive.setValue(false);
      }
      this.StaffForm.controls.OwnerID.setValue(this.GV.ownerID);
      this.StaffForm.controls.outletID.setValue(this.GV.OutletID);
      this.StaffModelRequest = this.StaffForm.value;
      this.API.PostData('/FoodMenu/AddEditStaff', this.StaffModelRequest).subscribe(c => {
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
          this.getStaff();
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

  getStaff() {
    this.API.getdata('/FoodMenu/getStaff?outletID=' + this.GV.OutletID).subscribe(c => {
      if (c != null) {
        this.StaffModelResponse = c.responseStaff;
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

  editStaff(p: any) {
    this.addMode = !this.addMode;
    this.isShow = !this.isShow;
    this.StaffForm.patchValue(p);
  }

  isActiveCheck(check: boolean) {
    if (check == true) {
      this.StaffForm.controls.isActive.setValue(true);
    } else {
      this.StaffForm.controls.isActive.setValue(false);
    }
  }

  onItemSelect(item: any) {
    this.assignGroupsModel.AssignedGroups.push(item);
  }
  onItemDeSelect(item: any) {
    this.assignGroupsModel.AssignedGroups
      .splice(this.assignGroupsModel.AssignedGroups
        .findIndex(ele => ele.GroupId == item.GroupId), 1);
  }
  onItemDeSelectAll(item: any) {
    this.assignGroupsModel.AssignedGroups = [];
  }
  onSelectAll(items: any) {
    this.assignGroupsModel.AssignedGroups = items;
  }

  AssignGroup(grp: any) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'GroupId',
      textField: 'GroupName',
      selectAllText: 'Select All Groups',
      unSelectAllText: 'UnSelect All Groups',
      itemsShowLimit: 7,
      allowSearchFilter: true
    }
    this.assignModel.selectedGroup = grp;
    this.getGroupAssignedRoles(grp.staffID).then(roles => {
      this.groupAssignedRoleList = roles;
      this.selectedRoles = roles;
      this.assignGroupsModel.AssignedGroups = roles;
    });
    this.assignGroupsModel.staffID = grp.staffID;
    this.staffName = grp.StaffName
  }

  saveAssignRole() {
    this.API.PostData('/ManageGroup/AssignGroup', this.assignGroupsModel).subscribe(
      c => {
        if (!c.payload) {
          this.toastr.error(c.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        }
        else {
          this.toastr.success(c.message, 'Success', {
            timeOut: 3000,
            'progressBar': true,
          });
          this.closeAssignRoleModal["first"].nativeElement.click();
        }
      },
      error => {
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          'progressBar': true,
        });
      });
  }

  getGroupAssignedRoles(staffID: any) {
    return new Promise<any>(resolve => {
      this.API.getdata('/ManageGroup/ViewAssignedGroups?staffID=' + staffID).subscribe(
        data => {
          if (data != null) {
            this.GroupResponseModel = data;
            resolve(data);
          }
          else {
          }
        },
        error => {
          this.toastr.error(error.message, 'Error', {
            timeOut: 3000,
            'progressBar': true,
          });
        });
    });
  }
}

