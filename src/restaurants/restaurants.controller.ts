import { Controller, Post, Get, Body, Query, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { FilterRestaurantDto } from './dtos/filter-restaurant.dto';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { NearbyRestaurantDto } from './dtos/nearby-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async create(@Body() dto: CreateRestaurantDto) {
        return this.restaurantsService.create(dto);
    }

    @Get()
    async findAll(@Query() filters: FilterRestaurantDto) {
        return this.restaurantsService.findAll(filters);
    }

    @Get('nearby')
    async findNearby(@Query() dto: NearbyRestaurantDto) {
        return this.restaurantsService.findNearby(dto);
    }

    @Get(':identifier')
    async findOne(@Param('identifier') identifier: string) {
        return this.restaurantsService.findOne(identifier);
    }
}