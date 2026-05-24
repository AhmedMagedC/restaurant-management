import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema';
import { UserCuisine, UserCuisineDocument } from './schemas/user-cuisine.schema';
import { UserRestaurant, UserRestaurantDocument } from './schemas/user-restaurant.schema';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        @InjectModel(UserCuisine.name)
        private readonly userCuisineModel: Model<UserCuisineDocument>,

        @InjectModel(UserRestaurant.name)
        private readonly userRestaurantModel: Model<UserRestaurantDocument>,
    ) { }

    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId);
    }

    async getRecommendations(userId: string): Promise<any> {
        const userObjectId = new Types.ObjectId(userId);

        // the aggregation logic is as follows :=> 
        // from user-cuisines table return cuisine_ids where userObjectId = user-cuisines.user_id (the list of cuisines the user favors)
        // then from the same table return list of user_ids which they also share one or more of the same cuisine_id
        // then from the user-restaurants return list of restaurnats_ids these users follow
        // then access the Restaurants table to return the restaurant data 
        const result = await this.userModel.aggregate([
            { $match: { _id: userObjectId } },
            {
                $lookup: {
                    from: 'usercuisines',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'my_cuisines',
                },
            },
            {
                $lookup: {
                    from: 'usercuisines',
                    let: { my_cuisine_ids: '$my_cuisines.cuisine_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$cuisine_id', '$$my_cuisine_ids'] },
                                        { $ne: ['$user_id', userObjectId] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'similar_user_cuisines',
                },
            },
            {
                $lookup: {
                    from: 'userrestaurants',
                    let: { similar_user_ids: '$similar_user_cuisines.user_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ['$user_id', '$$similar_user_ids'] },
                            },
                        },
                        {
                            $lookup: {
                                from: 'restaurants',
                                localField: 'restaurant_id',
                                foreignField: '_id',
                                as: 'restaurant_details',
                            },
                        },
                        { $unwind: '$restaurant_details' },
                        { $replaceRoot: { newRoot: '$restaurant_details' } },
                        {
                            $group: {
                                _id: '$_id',
                                name: { $first: '$name' },
                                unique_name: { $first: '$unique_name' },
                            },
                        },
                    ],
                    as: 'recommended_restaurants',
                },
            },
            {
                $project: {
                    _id: 0,
                    similar_users: '$similar_user_cuisines.user_id',
                    recommended_restaurants: {
                        _id: 1,
                        name: 1,
                        unique_name: 1,
                    },
                },
            },
        ]);

        return result[0] ?? { similar_users: [], recommended_restaurants: [] };
    }
}