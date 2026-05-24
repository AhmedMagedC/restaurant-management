import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserRestaurantDocument = UserRestaurant & Document;

@Schema({ timestamps: false })
export class UserRestaurant {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user_id!: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Restaurant' })
    restaurant_id!: Types.ObjectId;
}

export const UserRestaurantSchema = SchemaFactory.createForClass(UserRestaurant);

// user can't follow the same restaurant twice
UserRestaurantSchema.index({ user_id: 1, restaurant_id: 1 }, { unique: true });