export class responseOrder {
    kotID: number = 0;
    kotNO: number = 0;
    outletID: number = 0;
    ownerID: number = 0;
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
export class requestOrder {
    orderID: number = 0;
    outletID: number;
}
export class POSModelRequest {
    responseOrder: responseOrder;
    responseReceiptArr: responseReceiptArr[];
    responseTable: responseTable[];
    responseCustomer: responseCustomer;
    constructor() {
        this.responseReceiptArr = [];
        this.responseTable = [];
        this.responseCustomer = new responseCustomer();
        this.responseOrder = new responseOrder();
    }
}