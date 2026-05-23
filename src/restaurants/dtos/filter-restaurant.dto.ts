import { IsOptional, IsString } from 'class-validator';

export class FilterRestaurantDto {
    @IsOptional()
    @IsString()
    cuisine?: string;
}