export class FoodCatRequestModel {
    constructor() {
        this.foodMenuID = 0;
        this.foodMenuName = "";
        this.isActive = false;
        this.outletID = 0;
    }
    foodMenuID: number;
    foodMenuName: string;
    isActive: boolean;
    outletID: number;
}

export class FoodCatResponseModel {
    constructor() {
        this.foodMenuID = 0;
        this.foodMenuName = "";
        this.isActive = false;
        this.outletID = 0;
    }
    foodMenuID: number;
    foodMenuName: string;
    isActive: boolean;
    outletID: number;
}