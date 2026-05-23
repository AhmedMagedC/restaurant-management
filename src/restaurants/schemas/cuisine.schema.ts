import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CuisineDocument = Cuisine & Document;

@Schema({ timestamps: true })
export class Cuisine {
    @Prop({
        required: true,
        unique: true,
        trim: true,
    })
    name!: string;
}

export const CuisineSchema = SchemaFactory.createForClass(Cuisine);