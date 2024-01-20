import { IUserProps, User } from '~sl-modules/users';
import mongoose from 'mongoose';
import { IUserRepository } from '../user.repository';
import { IMongoModelProvider } from '~sl-core/persistence/configuration.mongo';

export default class MongooseUserRepository implements IUserRepository {
    private users: mongoose.Model<IUserProps>;

    constructor(models: IMongoModelProvider) {
        this.users = models.getModel<IUserProps>('user');
    }

    createNextId(): string {
        return new mongoose.Types.ObjectId().toString();
    }

    async create(user: User): Promise<any> {
        await this.users.create({
            id: mongoose.Types.ObjectId.createFromHexString(user.id),
            username: user.username,
            password: user.password
        });

        return;
    }

    async exists(username: string): Promise<boolean> {
        const user = await this.users.exists({ username: username });

        return user !== null;
    }

    async getByUsername(username: string): Promise<User | null> {
        const userEntity = await this.users.findOne({ username: username });

        if (userEntity == null) {
            return null;
        }

        return new User(
            userEntity.id,
            {
                username: userEntity.username,
                password: userEntity.password,
            }
        );
    }
}
