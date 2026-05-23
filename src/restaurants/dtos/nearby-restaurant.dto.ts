import { IsNumber, Min, Max, IsLongitude, IsLatitude } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyRestaurantDto {
    @Type(() => Number)
    @IsLongitude()
    longitude!: number;

    @Type(() => Number)
    @IsLatitude()
    latitude!: number;

}