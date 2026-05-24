import { ApiProperty } from '@nestjs/swagger';

class RecommendedRestaurantDto {
    @ApiProperty({ example: '665f1a2b3c4d5e6f7a8b9c0d' })
    _id!: string;

    @ApiProperty({ example: { en: 'KFC', ar: 'كنتاكي' } })
    name!: {
        en: string;
        ar: string;
    };

    @ApiProperty({ example: 'KFC' })
    unique_name!: string;
}

export class RecommendationResponseDto {
    @ApiProperty({
        example: ['665f1a2b3c4d5e6f7a8b9c0d', '665f1a2b3c4d5e6f7a8b9c0e'],
        description: 'IDs of users who share the same favorite cuisines',
    })
    similar_users!: string[];

    @ApiProperty({
        type: [RecommendedRestaurantDto],
        description: 'Restaurants followed by similar users',
    })
    recommended_restaurants!: RecommendedRestaurantDto[];
}