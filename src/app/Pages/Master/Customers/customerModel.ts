export class requestCustomer {
    customerName: string;
    mobileNO: string;
    refCode: string;
    Address: string;
    isActive: string;
    companyID: number;
    UserID: number;
    customerID: number;
}
export class responseCustomer {
    customerName: string;
    mobileNO: string;
    refCode: string;
    Address: string;
    isActive: string;
    companyID: number;
    UserID: number;
    customerID: number;
}

export class requestCustomerInfo {
    customerInfoID: number = 0;
    Adress: string;
    Phone: string;
    customerID: number = 0;
    UserID: number = 0;
}

    export class customerModel {
        requestCustomer: requestCustomer;
        requestCustomerInfo: requestCustomerInfo;
    
        constructor() {
            this.requestCustomer = new requestCustomer();
            this.requestCustomerInfo = new requestCustomerInfo();
        }
    }