export class requestTable {
    tableName: string;
    seatCapacity: number;
    isActive: string;
    outletID: number;
    UserID: number;
    tableID: number;
    description: string;
}
export class responseTable {
    tableName: string;
    seatCapacity: number;
    isActive: string;
    outletID: number;
    UserID: number;
    customerID: number;
    tableID: number;
    description: string;
    occupied: number;
    available: number;
}