import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserCuisineDocument = UserCuisine & Document;

@Schema({ timestamps: false })
export class UserCuisine {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    user_id!: Types.ObjectId;

    @Prop({ required: true, type: Types.ObjectId, ref: 'Cuisine' })
    cuisine_id!: Types.ObjectId;
}

export const UserCuisineSchema = SchemaFactory.createForClass(UserCuisine);

// user can't have the same cuisine twice as his favourite
UserCuisineSchema.index({ user_id: 1, cuisine_id: 1 }, { unique: true });