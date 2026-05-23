import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsNumber,
    ArrayMinSize,
    ArrayMaxSize,
    ValidateNested,
    isNotEmpty,
    IsLongitude,
    IsLatitude,
} from 'class-validator';
import { Type } from 'class-transformer';

class RestaurantNameDto {
    @IsString()
    @IsNotEmpty()
    en!: string;

    @IsString()
    @IsNotEmpty()
    ar!: string;
}

class CoordinatesDto {
    @IsNotEmpty()
    @IsLongitude()
    longitude!: number;

    @IsNotEmpty()
    @IsLatitude()
    latitude!: number;
}

export class CreateRestaurantDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RestaurantNameDto)
    name!: RestaurantNameDto;

    @IsNotEmpty()
    @IsString()
    unique_name!: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'A restaurant must have at least 1 cuisine' })
    @ArrayMaxSize(3, { message: 'A restaurant can have at most 3 cuisines' })
    cuisine_names!: string[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    location!: CoordinatesDto;
}