import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { RestaurantCuisine, RestaurantCuisineDocument } from './schemas/restaurant-cuisine.schema';

@Injectable()
export class RestaurantsRepository {
    constructor(
        @InjectModel(Restaurant.name)
        private readonly restaurantModel: Model<RestaurantDocument>,

        @InjectModel(RestaurantCuisine.name)
        private readonly restaurantCuisineModel: Model<RestaurantCuisineDocument>,
    ) { }

    async findByUniqueName(unique_name: string): Promise<RestaurantDocument | null> {
        return this.restaurantModel.findOne({ unique_name });
    }

    async findById(id: string): Promise<RestaurantDocument | null> {
        return this.restaurantModel.findById(id);
    }

    async createRestaurant(data: {
        name: { en: string; ar: string };
        unique_name: string;
        location: { type: 'Point'; coordinates: [number, number] };
    }): Promise<RestaurantDocument> {
        return this.restaurantModel.create(data);
    }

    async linkCuisines(
        restaurant_id: Types.ObjectId,
        cuisine_ids: Types.ObjectId[],
    ): Promise<void> {
        const junctionDocs = cuisine_ids.map((cuisine_id) => ({
            restaurant_id,
            cuisine_id,
        }));

        try {
            await this.restaurantCuisineModel.insertMany(junctionDocs);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ConflictException(
                    'One or more cuisines are already linked to this restaurant',
                );
            }
            throw error;
        }
    }

    async findAll(cuisineName?: string): Promise<any[]> {
        const pipeline: any[] = [
            {
                $lookup: {
                    from: 'restaurantcuisines',
                    localField: '_id',
                    foreignField: 'restaurant_id',
                    as: 'restaurant_cuisines',
                },
            },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'restaurant_cuisines.cuisine_id',
                    foreignField: '_id',
                    as: 'cuisines',
                },
            },
            ...(cuisineName
                ? [
                    {
                        $match: {
                            'cuisines.name': cuisineName,
                        },
                    },
                ]
                : []),
            {
                $project: {
                    restaurant_cuisines: 0, // remove the raw junction array from response
                },
            },
        ];

        return this.restaurantModel.aggregate(pipeline);
    }

    async findByIdOrUniqueName(identifier: string): Promise<any | null> {
        // if it's not a valid ObjectId we skip the _id check entirely
        // to avoid a cast error in MongoDB
        const matchStage = Types.ObjectId.isValid(identifier)
            ? { $match: { $or: [{ _id: new Types.ObjectId(identifier) }, { unique_name: identifier }] } }
            : { $match: { unique_name: identifier } };

        return this.restaurantModel.aggregate([
            matchStage,
            {
                $lookup: {
                    from: 'restaurantcuisines',
                    localField: '_id',
                    foreignField: 'restaurant_id',
                    as: 'restaurant_cuisines',
                },
            },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'restaurant_cuisines.cuisine_id',
                    foreignField: '_id',
                    as: 'cuisines',
                },
            },
            {
                $project: { restaurant_cuisines: 0 }, // remove the raw junction array from response
            },
            { $limit: 1 },
        ]).then(results => results[0] ?? null);
    }

    async findNearby(longitude: number, latitude: number): Promise<any[]> {
        const RADIUS_IN_METERS = 1000; // 1KM

        return this.restaurantModel.aggregate([
            // filter restaurants within 1KM radius
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    distanceField: 'distance_in_meters',
                    maxDistance: RADIUS_IN_METERS,
                    spherical: true,
                },
            },
            {
                $lookup: {
                    from: 'restaurantcuisines',
                    localField: '_id',
                    foreignField: 'restaurant_id',
                    as: 'restaurant_cuisines',
                },
            },
            {
                $lookup: {
                    from: 'cuisines',
                    localField: 'restaurant_cuisines.cuisine_id',
                    foreignField: '_id',
                    as: 'cuisines',
                },
            },
            {
                $project: {
                    restaurant_cuisines: 0,
                    location: 0, // no need to expose raw coordinates in response
                },
            },
        ]);
    }
}