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


export class MenuItemsModel {
    requestVariants: requestVariant[];
    requestFoodMenuItem: requestFoodMenuItem;
    constructor() {
        this.requestVariants = [];
        this.requestFoodMenuItem = new requestFoodMenuItem();
    }
}
export class requestFoodMenuItem {
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
    refCode: string;
}
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
}
export class requestVariant {
    variantID: number;
    variantName: string;
    variantPrice: number;
    discount: number;
    calculatedPrice: number;
    description: string;
    foodItemID: number;
    imageURL: any;
}
export class responseVariant {
    variantID: number;
    variantName: string;
    variantPrice: number;
    discount: number;
    calculatedPrice: number;
    description: string;
    foodItemID: number;
    imageURL: any;
}