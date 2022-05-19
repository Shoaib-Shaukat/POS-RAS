export class requestSection {
    sectionID: number;
    sectionName: string;
    outletID: number;
    userID: number;
    invoiceFormat: number;
    billFormat: number;
    kotFormat: number;
    hasScreen: boolean;
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
    isActive: boolean;
}

export class responsePrinter {
    printerID: number;
    printerIP: number;
    printerPort: number;
    printerTitle: string;
    outletID: number;
    isActive: boolean;
}

export class requestPrinter {
    printerID: number;
    printerIP: number;
    printerPort: number;
    printerTitle: string;
    outletID: number;
    isActive: boolean;
    sectionID: number;
}
export class requestSectionModel {
    requestPrinter: requestPrinter[];
    requestSection: requestSection;
    constructor() {
        this.requestPrinter = [];
        this.requestSection = new requestSection();
    }
}