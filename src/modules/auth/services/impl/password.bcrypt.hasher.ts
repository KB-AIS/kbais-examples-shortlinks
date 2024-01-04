import bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../password.hasher';

export class BcryptPasswordHasher implements IPasswordHasher {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();

        const passwordHashed = await bcrypt.hash(password, salt);

        return passwordHashed;
    }

    isGenuine(password: string, passwordHashed: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHashed);
    }
}
