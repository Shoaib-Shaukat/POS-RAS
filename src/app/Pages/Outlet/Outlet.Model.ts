
export class OutletRequestModel {
    outletID: number;
    outletName: string;
    phone: string;
    email: string;
    address: string;
    hasKitchen: string;
    isActive: boolean;
    companyID: number;
    UserID: number;
    currencyID: number;
}

export class OutletResponseModel {
    outletID: number;
    outletName: string;
    phone: string;
    email: string;
    address: string;
    hasKitchen: string;
    isActive: boolean;
    companyID: number;
    UserID: number;
    currencyID: number;
}


export class getOutletRequest {
    CompanyID: number;
    UserID: number;
}