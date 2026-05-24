import { Controller, Post, Get, Body, Query, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { FilterRestaurantDto } from './dtos/filter-restaurant.dto';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { NearbyRestaurantDto } from './dtos/nearby-restaurant.dto';
import { RestaurantResponseDto } from './dtos/restaurant-response.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new restaurant' })
    @ApiResponse({ status: 201, type: RestaurantResponseDto, description: 'Restaurant created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 404, description: 'Cuisine not found' })
    @ApiResponse({ status: 409, description: 'unique_name already exists' })
    async create(@Body() dto: CreateRestaurantDto) {
        return this.restaurantsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List all restaurants' })
    @ApiQuery({ name: 'cuisine', required: false, description: 'Filter by cuisine name' })
    @ApiResponse({ status: 200, type: [RestaurantResponseDto], description: 'List of restaurants' })
    async findAll(@Query() filters: FilterRestaurantDto) {
        return this.restaurantsService.findAll(filters);
    }

    @Get('nearby')
    @ApiOperation({ summary: 'Find restaurants within 1KM radius' })
    @ApiQuery({ name: 'latitude', required: true, example: 30.0444 })
    @ApiQuery({ name: 'longitude', required: true, example: 31.2357 })
    @ApiResponse({ status: 200, type: [RestaurantResponseDto], description: 'List of nearby restaurants' })
    async findNearby(@Query() dto: NearbyRestaurantDto) {
        return this.restaurantsService.findNearby(dto);
    }

    @Get(':identifier')
    @ApiOperation({ summary: 'Get restaurant by ID or unique_name' })
    @ApiParam({ name: 'identifier', description: 'MongoDB ID or unique_name slug' })
    @ApiResponse({ status: 200, type: RestaurantResponseDto, description: 'Restaurant details' },)
    @ApiResponse({ status: 404, description: 'Restaurant not found' })
    async findOne(@Param('identifier') identifier: string) {
        return this.restaurantsService.findOne(identifier);
    }
}