export class CuisineResponseDto {
    name: string;

    constructor(cuisine: { name: string }) {
        this.name = cuisine.name;
    }
}

export class RestaurantResponseDto {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    unique_name: string;
    distance_in_meters?: number;
    cuisines: CuisineResponseDto[];

    constructor(restaurant: any) {
        this._id = restaurant._id.toString();
        this.name = {
            en: restaurant.name.en,
            ar: restaurant.name.ar,
        };
        this.unique_name = restaurant.unique_name;
        this.distance_in_meters = restaurant.distance_in_meters ?? undefined;
        this.cuisines = restaurant.cuisines.map(
            (c) => new CuisineResponseDto(c),
        );
    }
}