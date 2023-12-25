import { getModel } from '@/configuration/persistence/configuration.mongo';
import { IUserProps, User } from '@/modules/users/domain';
import mongoose from 'mongoose';
import { IUserRepository } from '../user.repository';

export default class MongooseUserRepository implements IUserRepository {

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(user: User): Promise<any> {
        await getModel<IUserProps>('user').create({
            id: mongoose.Types.ObjectId.createFromHexString(user.id),
            username: user.username,
            password: user.password
        });

        return;
    }

    async exists(username: string): Promise<boolean> {
        const user = await getModel<IUserProps>('user').exists({ username: username });

        return user !== null;
    }

    async getByUsername(username: string): Promise<User | null> {
        const userEntity = await getModel<IUserProps>('user').findOne({ username: username });

        if (userEntity == null) {
            return null;
        }

        return new User(userEntity.id, { ...userEntity });
    }
}
