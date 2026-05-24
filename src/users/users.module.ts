import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

import { User, UserSchema } from './schemas/user.schema';
import { UserCuisine, UserCuisineSchema } from './schemas/user-cuisine.schema';
import { UserRestaurant, UserRestaurantSchema } from './schemas/user-restaurant.schema';
import { Cuisine, CuisineSchema } from '../restaurants/schemas/cuisine.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: UserCuisine.name, schema: UserCuisineSchema },
            { name: UserRestaurant.name, schema: UserRestaurantSchema },
            { name: Cuisine.name, schema: CuisineSchema },
            { name: Restaurant.name, schema: RestaurantSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule { }