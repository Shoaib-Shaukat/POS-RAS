
export class OutletRequestModel {
    constructor() {
        this.outletID = 0;
        this.outletName = "";
        this.phone = "";
        this.email = "";
        this.address = "";
        this.defaultWaiter = "";
        this.hasKitchen = "";
        this.Active = false
        this.createdBy = "";
        this.modifiedDate = "";
        this.modifiedBy = "";
        this.isDeleted = false;
        this.companyID = 0;
        this.ownerID = 0;
    }
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
    ownerID: number;
}

export class OutletResponseModel {
    constructor() {
        this.outletID = 0;
        this.outletName = "";
        this.phone = "";
        this.email = "";
        this.address = "";
        this.defaultWaiter = "";
        this.hasKitchen = "";
        this.Active = false
        this.createdBy = "";
        this.modifiedDate = "";
        this.modifiedBy = "";
        this.isDeleted = false;
        this.companyID = 0;
    }
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
}