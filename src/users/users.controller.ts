import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RecommendationResponseDto } from './dtos/recommendation-response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':userId/recommendations')
    @ApiOperation({ summary: 'Get restaurant recommendations for a user' })
    @ApiParam({ name: 'userId', description: 'MongoDB user ID' })
    @ApiResponse({ status: 200, type: RecommendationResponseDto })
    @ApiResponse({ status: 400, description: 'Invalid user ID' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getRecommendations(@Param('userId') userId: string) {
        return this.usersService.getRecommendations(userId);
    }
}