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
import { ApiProperty } from '@nestjs/swagger';

class RestaurantNameDto {
    @ApiProperty({ example: 'KFC' })
    @IsString()
    @IsNotEmpty()
    en!: string;

    @ApiProperty({ example: 'كنتاكي' })
    @IsString()
    @IsNotEmpty()
    ar!: string;
}

class CoordinatesDto {
    @ApiProperty({ example: 31.2357 })
    @IsNotEmpty()
    @IsLongitude()
    longitude!: number;

    @ApiProperty({ example: 30.0444 })
    @IsNotEmpty()
    @IsLatitude()
    latitude!: number;
}

export class CreateRestaurantDto {
    @ApiProperty({ type: RestaurantNameDto })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => RestaurantNameDto)
    name!: RestaurantNameDto;

    @ApiProperty({ example: 'KFC' })
    @IsNotEmpty()
    @IsString()
    unique_name!: string;

    @ApiProperty({ example: ['Burgers', 'Fried'], minItems: 1, maxItems: 3 })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1, { message: 'A restaurant must have at least 1 cuisine' })
    @ArrayMaxSize(3, { message: 'A restaurant can have at most 3 cuisines' })
    cuisine_names!: string[];

    @ApiProperty({ type: CoordinatesDto })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CoordinatesDto)
    location!: CoordinatesDto;
}