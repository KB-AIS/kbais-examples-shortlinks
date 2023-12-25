import { User } from '@/modules/users/domain';

export interface IUserRepository {
    createNextId(): string;

    create(user: User): Promise<any>;

    exists(username: string): Promise<boolean>;

    getByUsername(username: string): Promise<User | null>;
}