export class CompaniesResponseModel {
    constructor() {
        this.companyID = 0;
        this.companyName = "";
        this.ownerID = 0;
        this.isActive = false;
    }
    companyID: number;
    companyName: string;
    ownerID: number;
    isActive: boolean;
    color: string;
}

export class CompaniesRequestModel {
    constructor() {
        this.companyID = 0;
        this.companyName = "";
        this.ownerID = 0;
        this.isActive = false;
    }
    companyID: number;
    companyName: string;
    ownerID: number;
    isActive: boolean;
}