import { IUserRepository } from '@/application/users';
import logger from '@/core/core.logger.pino';
import { Either, EitherV, failureE, failureV, success, successV } from '@/core/core.result';
import { User } from '@/domain';
import jwt from 'jsonwebtoken';
import { IPasswordHasher } from './password.hasher';

interface SessionPayload {
    username: string
}

interface Session {
    accessToken: string,
    rotateToken: string
}

export enum AuthServiceError {
    UsernameIsTaken = 'Username already taken',
    UserDoesNotExist = 'User does not exist',
    CredentialFailure = 'Username or password is invalid',
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private passwordHasher: IPasswordHasher
    ) { }

    async registerUser(cmd: { username: string, password: string }): Promise<Either<AuthServiceError>> {
        if (await this.userRepository.exists(cmd.username)) {
            return failureE(AuthServiceError.UsernameIsTaken);
        }

        const user = new User(
            this.userRepository.createNextId(),
            {
                username: cmd.username,
                password: await this.passwordHasher.hash(cmd.password)
            }
        );

        await this.userRepository.create(user);

        logger.info('A new user has been signed in');

        return success();
    }

    async createSession(cmd: { username: string, password: string }): Promise<EitherV<Session, AuthServiceError>> {
        const user = await this.userRepository.getByUsername(cmd.username);

        if (user === null) {
            return failureV(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.verify(cmd.password, user.password) == false) {
            return failureV(AuthServiceError.CredentialFailure);
        }

        const sessionAccessToken = jwt.sign(
            {
                username: user.username,
            },
            'VERYVERYVERYVERYVERYSECRETSECRETKEY',
            {
                expiresIn: '10m'
            }
        );

        const userSession = jwt.verify(sessionAccessToken, 'VERYVERYVERYVERYVERYSECRETSECRETKEY') as SessionPayload;

        // TODO: Create JWT, Create Refresh Token, Persist Refresh Token

        logger.info({ userId: user.id }, 'A new user session has been created');

        return successV({ accessToken: sessionAccessToken, rotateToken: '' });
    }
}