import { User } from '../domain/user.entity';

export interface IUserRepository {
    createNextId(): string;

    create(user: User): Promise<any>;

    exists(username: string): Promise<boolean>;

    getByUsername(username: string): Promise<User | null>;
}