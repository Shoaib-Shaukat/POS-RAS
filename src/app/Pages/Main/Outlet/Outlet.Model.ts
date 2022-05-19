
export class requestOutlet {
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
    invoiceFormat: number;
    billFormat: number;
    kotFormat: number;
    outletLogo: string;
    serviceCharges: number;
    takeawayCharges: number;
    deliveryCharges: number;
    invoiceTypeID: number;
    paymentModeID: number;
    deliveryChargesPer: number;
    takeawayChargesPer: number;
    serviceChargesPer: number;
    posID: number;
    usinNumber: string;
    pctCode: string;
    endPoint: string;
    posFee: number;
    taxOffice: string;
    outletNTNNumber: number;
    outletSTRNumber: number;
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
    outletLogo: string;
    color: string;
    serviceCharges: number;
    takeawayCharges: number;
    deliveryCharges: number;
    invoiceFormat: number;
    billFormat: number;
    kotFormat: number;
    invoiceTypeID: number;
    paymentModeID: number;
    deliveryChargesPer: number;
    takeawayChargesPer: number;
    serviceChargesPer: number;
    posID: number;
    usinNumber: string;
    pctCode: string;
    endPoint: string;
    posFee: number;
    taxOffice: string;
    outletNTNNumber: number;
    outletSTRNumber: number;
}

export class requestPrinter {
    printerID: number;
    printerIP: number;
    printerPort: number;
    printerTitle: string;
    outletID: number;
    isActive: boolean;
}

export class requestOutletModel {
    requestPrinter: requestPrinter[];
    requestOutlet: requestOutlet;
    constructor() {
        this.requestPrinter = [];
        this.requestOutlet = new requestOutlet();
    }
}

export class getOutletRequest {
    CompanyID: number;
    UserID: number;
}


export class responsePrinter {
    printerID: number;
    printerIP: number;
    printerPort: number;
    printerTitle: string;
    outletID: number;
    isActive: boolean;
}

export class invoiceTypesResponse {
    invoiceTypeID: number;
    invoiceTypeName: string;
}

export class paymentTypesResponse {
    paymentModeID: number
    paymentModeName: string;
}