export interface Store {
    id: number;
    storeName: string;
    storeSlug: string;
    storeLogo: string;
    description: string;
    rating: number;
    numReviews: number;
    storeAddress: string;
    storeEmail: string;
    storePhone: string;
    storeWebsite: string;
    createdAt: Date;
}