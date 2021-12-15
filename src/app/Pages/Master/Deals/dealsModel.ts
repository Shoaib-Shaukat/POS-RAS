export class requestDealsModel {
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