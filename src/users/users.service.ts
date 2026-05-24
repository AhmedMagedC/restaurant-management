import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async getRecommendations(userId: string) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid user ID');
        }

        const user = await this.usersRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User ${userId} not found`);
        }

        return this.usersRepository.getRecommendations(userId);
    }
}