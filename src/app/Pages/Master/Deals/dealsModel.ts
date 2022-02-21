export class DealsModel {
    DealID: number;
    DealName: string;
    DealPrice: number;
    description: string;
    isActive: boolean;
    imageURL: any;
    outletID: number;
    UserID: number;
    itemsDescription: string;
}
export class requestDealsModel {
    DealID: number;
    DealDetailID: number;
    FoodItemName: string;
    CalPrice: number;
    Price: number;
    FoodItemID: number;
    FoodMenuID: number;
    FoodMenuName: string;
    hasVariant: boolean;
    RefCode: number;
    variantID: number;
    variantName: string;
    variantPrice: number;
    Quantity: number;
}
export class responseDealsModel {
    dealID: number;
    dealName: string;
    dealPrice: number;
    description: string;
    imageURL: any;
    isActive: boolean;
    itemsDescription: string;
}

export class responseFoodMenuItem {
    foodItemID: number;
    foodItemName: string;
    description: string;
    price: number;
    isActive: boolean;
    hasVariant: boolean;
    foodMenuID: number;
    UserID: number;
    discount: number;
    calculatedPrice: number;
    imageURl: any;
    foodMenuName: string;
    refCode: string;
    Quantity: number;
    Checked: boolean;
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
    Quantity: number;
    Checked: boolean;
}


export class DealModelRequest {
    DealsArray: requestDealsModel[];
    DealObject: DealsModel;

    constructor() {
        this.DealsArray = [];
        this.DealObject = new DealsModel();

    }
}