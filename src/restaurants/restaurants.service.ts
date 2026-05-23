import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RestaurantsRepository } from './restaurants.repository';
import { Cuisine, CuisineDocument } from './schemas/cuisine.schema';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { FilterRestaurantDto } from './dtos/filter-restaurant.dto';
import { NearbyRestaurantDto } from './dtos/nearby-restaurant.dto';

import { RestaurantMapper } from './mappers/restaurant.mapper'

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly restaurantsRepository: RestaurantsRepository,

        @InjectModel(Cuisine.name)
        private readonly cuisineModel: Model<CuisineDocument>,
    ) { }

    async create(dto: CreateRestaurantDto) {
        const exists = await this.restaurantsRepository.findByUniqueName(
            dto.unique_name,
        );
        if (exists) {
            throw new ConflictException(
                `A restaurant with unique_name "${dto.unique_name}" already exists`,
            );
        }

        const uniqueCuisineNames = [...new Set(dto.cuisine_names)];

        const foundCuisines = await this.cuisineModel.find({
            name: { $in: uniqueCuisineNames },
        });

        if (foundCuisines.length !== uniqueCuisineNames.length) {
            const foundNames = foundCuisines.map((c) => c.name);
            const invalidNames = uniqueCuisineNames.filter(
                (name) => !foundNames.includes(name),
            );
            throw new NotFoundException(
                `The following cuisines do not exist: ${invalidNames.join(', ')}`,
            );
        }

        const restaurant = await this.restaurantsRepository.createRestaurant({
            name: dto.name,
            unique_name: dto.unique_name,
            location: {
                type: 'Point',
                coordinates: [dto.location.longitude, dto.location.latitude],
            },
        });

        const cuisineObjectIds = foundCuisines.map((c) => c._id);
        await this.restaurantsRepository.linkCuisines(
            restaurant._id,
            cuisineObjectIds,
        );

        return RestaurantMapper.toResponse({
            ...restaurant.toObject(),
            cuisines: foundCuisines,
        });
    }

    async findAll(filters: FilterRestaurantDto) {
        const restaurants = await this.restaurantsRepository.findAll(filters.cuisine);
        return RestaurantMapper.toResponseList(restaurants);
    }

    async findOne(identifier: string) {
        const restaurant = await this.restaurantsRepository.findByIdOrUniqueName(identifier);
        if (!restaurant) {
            throw new NotFoundException(`Restaurant "${identifier}" not found`);
        }
        return RestaurantMapper.toResponse(restaurant);
    }

    async findNearby(dto: NearbyRestaurantDto) {
        const restaurants = await this.restaurantsRepository.findNearby(
            dto.longitude,
            dto.latitude,
        );
        return RestaurantMapper.toResponseList(restaurants);
    }
}