import { RestaurantResponseDto } from '../dtos/restaurant-response.dto';

export class RestaurantMapper {
    static toResponse(restaurant: any): RestaurantResponseDto {
        return new RestaurantResponseDto(restaurant);
    }

    static toResponseList(restaurants: any[]): RestaurantResponseDto[] {
        return restaurants.map(RestaurantMapper.toResponse);
    }
}