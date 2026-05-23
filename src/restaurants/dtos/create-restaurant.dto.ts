import {
    IsString,
    IsNotEmpty,
    IsArray,
    IsNumber,
    ArrayMinSize,
    ArrayMaxSize,
    ValidateNested,
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
    @IsNumber()
    @IsNotEmpty()
    longitude!: number;

    @IsNumber()
    @IsNotEmpty()
    latitude!: number;
}

export class CreateRestaurantDto {
    @ValidateNested()
    @Type(() => RestaurantNameDto)
    name!: RestaurantNameDto;

    @IsString()
    @IsNotEmpty()
    unique_name!: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'A restaurant must have at least 1 cuisine' })
    @ArrayMaxSize(3, { message: 'A restaurant can have at most 3 cuisines' })
    cuisine_names!: string[];

    @ValidateNested()
    @Type(() => CoordinatesDto)
    location!: CoordinatesDto;
}