import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RestaurantCuisineDocument = RestaurantCuisine & Document;

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

RestaurantCuisineSchema.index(
    { restaurant_id: 1, cuisine_id: 1 },
    { unique: true },
);