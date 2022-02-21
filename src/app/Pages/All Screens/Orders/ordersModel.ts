export class responseOrder {
    kotID: number = 0;
    kotNO: number = 0;
    outletID: number = 0;
    ownerID: number = 0;
    statusID: number = 0;
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

///////////////////////////////////////////////////////////
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

export class responseTable {
    tableName: string;
    seatCapacity: number;
    isActive: string;
    outletID: number;
    OwnerID: number;
    customerID: number;
    tableID: number;
    description: string;
    orderID: number = 0;
}