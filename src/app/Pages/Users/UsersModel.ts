export class UserModelResponse {
    address: string;
    cnic: string;
    companyID: number
    designation: string;
    dob: string;
    email: string;
    gender: string;
    isActive: boolean;
    mobileNo: string;
    name: string;
    ownerId: number
    password: string;
    userID: number
    willLogin: boolean;
}
export class OutletResponseModel {
    outletID: number;
    outletName: string;
    phone: string;
    email: string;
    address: string;
    defaultWaiter: string;
    hasKitchen: string;
    Active: boolean;
    createdBy: string;
    modifiedDate: string;
    modifiedBy: string;
    isDeleted: boolean;
    companyID: number;
    symbol: string;
    selected: boolean;
}
export class MenuResponse {
    assignMenuID: number;
    isActive: boolean;
    menuName: string;
    selected: boolean;
}
export class UserModelRequest {
    requestUser: requestUser;
    requestAssignOutlet: requestAssignOutlet[];
    requestUserMenu: requestUserMenu[];
    constructor() {
        this.requestAssignOutlet = [];
        this.requestUserMenu = [];
        this.requestUser = new requestUser();
    }
}
export class requestUser {
    userID: number;
    Gender: string;
    Cnic: string;
    Name: string;
    DOB: string;
    MobileNo: string;
    Address: string;
    Email: string;
    Password: string;
    Designation: string;
    isActive: boolean;
    companyID: number;
    ownerId: number;
    willLogin: boolean;
}
export class requestAssignOutlet {
    outletID: number;
}
export class requestUserMenu {
    assignMenuID: number;
}

export class getOutletRequest {
    CompanyID: number;
    UserID: number;
}