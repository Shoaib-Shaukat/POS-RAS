import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RolesRequestModel } from './RolesModel';
import { CurrentUserViewModel } from './UsersModel';
@Injectable({
  providedIn: 'root'
})
export class GvarService {
  openingDate: any = new Subject<any>();
  OutletInfo: any;
  OutletEntered: Subject<any> = new Subject<any>();
  CompanyEntered: Subject<any> = new Subject<any>();
  GoodsCallFrom: string;
  private Roles: RolesRequestModel[];
  G_IsRunning: boolean = false;
  companyID: number = 0;
  OutletID: number = 0;
  isOwner: any = false;
  OutletAddress: string = "";
  Currency: string = "";
  companyName: string = "";
  ownerID: number = 0;
  userID: any = 0;
  OutletName: string = "";
  locationID: number;
  userName: any;
  UserId: any;
  currentUser: CurrentUserViewModel;
  serverURL: string = environment.serverURL;
  serverURLLogin: string = environment.serverURLLogin;
  constructor() {
    this.userName = (localStorage.getItem('userName'));
    this.UserId = (localStorage.getItem('UserId'));
  }

  roleMatch(allowedRoles: any): boolean {
    var temp = (localStorage.getItem('userRoles'));
    if (temp == "undefined") {
      return false
    }
    this.Roles = JSON.parse(localStorage.getItem('userRoles') || '{}');

    for (var i = 0; i < this.Roles.length; i++) {
      var checkRole = this.Roles[i].RoleId
      if (allowedRoles == this.Roles[i].RoleId) {
        return true
      }
    }
    return false
  }
  get canAddEditOwner() {
    return this.roleMatch(1);
  }
  get canGetOwner() {
    return this.roleMatch(2);
  }
  get canAddEditCompany() {
    return this.roleMatch(3);
  }
  get canGetCompany() {
    return this.roleMatch(4);
  }
  get canAddEditOutlet() {
    return this.roleMatch(5);
  }
  get canGetOutlets() {
    return this.roleMatch(6);
  }

  SetOutlet(OutletName: any) {
    this.OutletEntered.next(OutletName);
  }
  SetCompany(CompanyName: any) {
    this.CompanyEntered.next(CompanyName);
  }
  setOpeningDate(val: any) {
    this.openingDate.next(val);
  }
}
