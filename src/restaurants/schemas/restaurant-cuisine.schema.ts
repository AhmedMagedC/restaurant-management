import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestaurantCuisineDocument = RestaurantCuisine & Document;

// for the many-to-many relationship , a restaurant can have a list of cuisines (1 to 3)
// and a cuisine can exist in many restaurants
@Schema({ timestamps: false })
export class RestaurantCuisine {
    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Restaurant',
    })
    restaurant_id!: Types.ObjectId;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Cuisine',
    })
    cuisine_id!: Types.ObjectId;
}

export const RestaurantCuisineSchema = SchemaFactory.createForClass(RestaurantCuisine);

// a restaurant cant have the same cuisine twice
RestaurantCuisineSchema.index(
    { restaurant_id: 1, cuisine_id: 1 },
    { unique: true },
);