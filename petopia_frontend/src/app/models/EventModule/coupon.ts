
export interface User {
    id: number;
    // ... autres propriétés
    xpPoints: number;
    level: number;
    coupons: Coupon[];
}

export interface Coupon {
    id: number;
    code: string;
    discountPercentage: number;
    isUsed: boolean;
    expirationDate: Date;
}