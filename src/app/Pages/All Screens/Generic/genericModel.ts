export class responseOrder {
    kotID: number = 0;
    kotNO: number = 0;
    outletID: number = 0;
    ownerID: number = 0;
    statusID: number = 0;
    remarks: string = "";
    orderType: string = "";
    tableDetail: any = [];
    minute: any = {};
}
export class tablesResponse {
    tableID: number;
    statusID: number;
    description: string;
    isActive: boolean;
    outletID: number;
    seatCapacity: number;
    tableName: string;
    kotID: number;
}
export class changeOrderStatus {
    kotID: number = 0;
    statusID: number = 0;
}

export class responseCustomer {
    customerName: string;
    mobileNO: string;
    refCode: string;
    address: string;
    isActive: string;
    companyID: number;
    OwnerID: number;
    customerID: number;
    orderID: number;
}
export class POSNewModelRequest {
    requestKotSR: requestKotSR;
    requestKot: requestKot;
    requestKotDetail: requestKotDetail[];
    requestCustomerTable: requestCustomerTable[];
    requestCustomerDetail: requestCustomerDetail;

    constructor() {
        this.requestKotSR = new requestKotSR();
        this.requestKot = new requestKot();
        this.requestKotDetail = [];
        this.requestCustomerTable = [];
        this.requestCustomerDetail = new requestCustomerDetail();
    }
}
export class requestKotSR {
    kotNO: string;
    kotDate: string;
    outletID: number = 0;
}

export class requestKot {
    kotNO: string;
    outletID: number = 0;
    OwnerID: number = 0;
    kotID: number = 0;
    remarks: string;
    orderType: string;
    timer: string;
}

export class requestKotDetail {
    quantity: number = 0;
    calculatedPrice: number = 0;
    discount: number = 0;
    foodItemID: number = 0;
    foodMenuID: number = 0;
    description: string;
    foodItemName: string;
    foodMenuName: string;
    hasVariant: boolean;
    isActive: boolean;
    newStr: string;
    price: number = 0;
    outletID: number = 0;
    refCode: string;
    variantID: number = 0;
    variantName: string;
    variantPrice: number = 0;
    dealID: number = 0;
    dealName: string;
    itemsDescription: string;
    dealPrice: number = 0;
    kotID: number = 0;
    kotDetailID: number = 0;
    sectionID: number = 0;
    sectionName: string;
    itemStatusID: number;
    itemStatus: string;
}

export class requestCustomerTable {
    customerTableID: number = 0;
    kotID: number = 0;
    tableID: number = 0;
}

export class requestCustomerDetail {
    customerDetailID: number = 0;
    kotID: number = 0;
    customerID: number = 0;
}

export class responseSection {
    sectionID: number;
    sectionName: string;
    outletID: number;
    userID: number;
    invoiceFormat: number;
    billFormat: number;
    kotFormat: number;
    hasScreen: boolean;
}

export class responseKotDetail {
    calculatedPrice: number;
    dealID: number;
    dealName: string;
    dealPrice: number;
    description: string;
    discount: number;
    foodItemID: number;
    foodItemName: string;
    foodMenuID: number;
    foodMenuName: string;
    hasVariant: boolean;
    isActive: boolean;
    itemStatus: string;
    itemStatusID: number;
    itemsDescription: string;
    kotDetailID: number;
    kotID: number;
    newStr: string;
    outletID: number;
    price: number;
    quantity: number;
    refCode: string;
    sectionID: number;
    sectionName: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    minute: any = {};
    kotNO: string;
    kotDetailgenericID: number
    timer: string;
}

export class responseKotDealDetail {
    calculatedPrice: number;
    dealID: number;
    dealName: string;
    dealPrice: number;
    description: string;
    discount: number;
    foodItemID: number;
    foodItemName: string;
    foodMenuID: number;
    foodMenuName: string;
    hasVariant: boolean;
    isActive: boolean;
    itemStatus: string;
    itemStatusID: number;
    itemsDescription: string;
    kotDetailID: number;
    kotID: number;
    newStr: string;
    outletID: number;
    price: number;
    quantity: number;
    refCode: string;
    sectionID: number;
    sectionName: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    minute: any = {};
    kotNO: string;
}