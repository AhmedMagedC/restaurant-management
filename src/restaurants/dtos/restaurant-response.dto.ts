import { ApiProperty } from '@nestjs/swagger';

export class CuisineResponseDto {
    @ApiProperty({ example: 'Burgers' })
    name: string;

    constructor(cuisine: { name: string }) {
        this.name = cuisine.name;
    }
}

class RestaurantNameDto {
    @ApiProperty({ example: 'KFC' })
    en!: string;

    @ApiProperty({ example: 'كنتاكي' })
    ar!: string;
}

export class RestaurantResponseDto {
    @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
    _id: string;

    @ApiProperty({ type: RestaurantNameDto })
    name: {
        en: string;
        ar: string;
    };

    @ApiProperty({ example: 'KFC' })
    unique_name: string;

    @ApiProperty({ example: 342.5, required: false })
    distance_in_meters?: number;

    @ApiProperty({ type: [CuisineResponseDto] })
    cuisines: CuisineResponseDto[];

    constructor(restaurant: any) {
        this._id = restaurant._id.toString();
        this.name = {
            en: restaurant.name.en,
            ar: restaurant.name.ar,
        };
        this.unique_name = restaurant.unique_name;
        this.distance_in_meters = restaurant.distance_in_meters ?? undefined;
        this.cuisines = restaurant.cuisines.map((c) => new CuisineResponseDto(c));
    }
}