import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsRepository } from './restaurants.repository'; 

import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { RestaurantCuisine, RestaurantCuisineSchema } from './schemas/restaurant-cuisine.schema';
import { Cuisine, CuisineSchema } from './schemas/cuisine.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Restaurant.name, schema: RestaurantSchema },
            { name: RestaurantCuisine.name, schema: RestaurantCuisineSchema },
            { name: Cuisine.name, schema: CuisineSchema },
        ]),
    ],
    controllers: [RestaurantsController],
    providers: [RestaurantsService, RestaurantsRepository],
    exports: [RestaurantsService],
})
export class RestaurantsModule { }