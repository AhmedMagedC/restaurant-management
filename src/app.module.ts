import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [databaseConfig],
        }),

        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('database.uri'),
            }),
        }),

        RestaurantsModule,
        UsersModule,
    ],
})
export class AppModule { }