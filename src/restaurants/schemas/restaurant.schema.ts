import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
    @Prop({
        required: true,
        type: {
            en: { type: String, required: true, trim: true },
            ar: { type: String, required: true, trim: true },
        },
    })
    name!: {
        en: string;
        ar: string;
    };

    @Prop({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    })
    unique_name!: string;

    // GeoJSON Point format
    @Prop(
        raw({
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        }),
    )
    location!: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ unique_name: 1 }, { unique: true });

RestaurantSchema.index({ location: '2dsphere' });