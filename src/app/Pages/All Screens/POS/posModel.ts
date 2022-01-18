export class responseFoodMenuItem {
    foodItemID: number;
    foodItemName: string;
    description: string;
    price: number;
    isActive: boolean;
    hasVariant: boolean;
    foodMenuID: number;
    OwnerID: number;
    discount: number;
    calculatedPrice: number;
    imageURl: any;
    foodMenuName: string;
    refCode: string;
    outletID: number;
    newStr: string;
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
export class allVariantsResponse {
    calculatedPrice: number;
    description: string;
    discount: number;
    foodItemID: number;
    foodItemName: string;
    foodMenuID: number;
    foodMenuName: string;
    hasVariant: boolean;
    imageURl: any;
    isActive: boolean;
    outletID: number;
    price: number;
    refCode: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    variantcalculatedPrice: number;
    variantdescription: string;
    variantdiscount: number;
    variantimageURL: any;
    variantrefCode: string;
}
export class FoodCatResponseModel {
    foodMenuID: number;
    foodMenuName: string;
    isActive: boolean;
    outletID: number;
    newStr: string
}
export class receiptArr {
    calculatedPrice: number;
    description: string;
    discount: number;
    foodItemID: number;
    foodItemName: string;
    foodMenuID: number;
    foodMenuName: string;
    hasVariant: boolean;
    isActive: boolean;
    outletID: number;
    price: number;
    refCode: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    quantity: number;
    dealID: number;
    dealName: string;
    dealPrice: number;
    itemsDescription: string;
    orderID: number = 0;
    remarks: string;
}
export class requestCustomer {
    customerName: string;
    mobileNO: string;
    refCode: string;
    Address: string;
    isActive: string;
    companyID: number;
    OwnerID: number;
    customerID: number;
    orderID: number = 0;
}
export class requestTable {
    tableName: string;
    seatCapacity: number;
    isActive: string;
    outletID: number;
    OwnerID: number;
    tableID: number;
    description: string;
    orderID: number = 0;
}
export class requestOrder {
    orderID: number = 0;
    outletID: number;
    kotNO: number;
    kotDate: string;
    orderType: string;
}
export class POSModelRequest {
    requestOrder: requestOrder;
    receiptArr: receiptArr[];
    requestTable: requestTable[];
    requestCustomer: requestCustomer;
    constructor() {
        this.receiptArr = [];
        this.requestTable = [];
        this.requestCustomer = new requestCustomer();
        this.requestOrder = new requestOrder();
    }
}

export class responseOrder {
    kotID: number = 0;
    kotNO: number = 0;
    outletID: number = 0;
    ownerID: number = 0;
    statusID: number = 0;
}


export class responseReceiptArr {
    calculatedPrice: number;
    description: string;
    discount: number;
    foodItemID: number;
    foodItemName: string;
    foodMenuID: number;
    foodMenuName: string;
    hasVariant: boolean;
    isActive: boolean;
    outletID: number;
    price: number;
    refCode: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    quantity: number;
    dealID: number;
    dealName: string;
    dealPrice: number;
    itemsDescription: string;
    orderID: number = 0;
    remarks: string;
}
// export class POSModelResponse {
//     responseOrder: responseOrder;
//     responseReceiptArr: responseReceiptArr[];
//     responseTable: responseTable[];
//     responseCustomer: responseCustomer;
//     constructor() {
//         this.responseReceiptArr = [];
//         this.responseTable = [];
//         this.responseCustomer = new responseCustomer();
//         this.responseOrder = new responseOrder();
//     }
// }


export class customerFavResponse {
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
    imageURl: string;
    isActive: boolean;
    itemsDescription: string;
    newStr: string;
    orderID: number;
    orderRecieptID: number;
    outletID: number;
    price: number;
    quantity: number;
    refCode: number;
    vImageURL: string;
    variantID: number;
    variantName: string;
    variantPrice: number;
    occurrence: number;
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
//.............................KOT Requests Models................................
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

//.............................KOT Responses Models................................

export class POSNewModelResponse {
    responseCustomerDetail: responseCustomerDetail;
    responseCustomerTable: responseCustomerTable[];
    responseKot: responseKot;
    responseKotDetail: responseKotDetail[];

    constructor() {
        this.responseCustomerDetail = new responseCustomerDetail();
        this.responseKotDetail = [];
        this.responseCustomerTable = [];
        this.responseKot = new responseKot();
    }
}

export class responseKot {
    kotNO: string;
    outletID: number = 0;
    OwnerID: number = 0;
    kotID: number = 0;
    remarks: string;
}

export class responseKotDetail {
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

export class responseCustomerTable {
    customerTableID: number = 0;
    kotID: number = 0;
    tableID: number = 0;
}

export class responseCustomerDetail {
    customerDetailID: number = 0;
    kotID: number = 0;
    customerID: number = 0;
}