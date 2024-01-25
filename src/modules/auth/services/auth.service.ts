import { f } from '~sl-core/results/index';
import { logger } from '~sl-core/utils';
import { IUserRepository, User, UserKind } from '~sl-modules/users';
import { IPasswordHasher } from './password.hasher';
import { ISessionAccessTokenIssuer } from './session.accesstoken.issuer';

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
        private passwordHasher: IPasswordHasher,
        private accessTokenIssuer: ISessionAccessTokenIssuer,
    ) { }

    async registerUser(cmd: { username: string, password: string }): Promise<f.Either<AuthServiceError>> {
        if (await this.userRepository.exists(cmd.username)) {
            return f.failureE(AuthServiceError.UsernameIsTaken);
        }

        const user = new User(
            this.userRepository.createNextId(),
            {
                kind: UserKind.SIGNED,
                username: cmd.username,
                password: await this.passwordHasher.hash(cmd.password),
            }
        );

        await this.userRepository.create(user);

        logger.info('A new user has been signed in');

        return f.success();
    }

    async createSession(cmd: { username: string, password: string }): Promise<f.EitherV<Session, AuthServiceError>> {
        const user = await this.userRepository.getByUsername(cmd.username);

        if (user === null) {
            return f.failureV(AuthServiceError.UserDoesNotExist);
        }

        if (await this.passwordHasher.isGenuine(cmd.password, user.password!) == false) {
            return f.failureV(AuthServiceError.CredentialFailure);
        }

        // TODO: Create JWT, Create Refresh Token, Persist Refresh Token
        const accessToken = this.accessTokenIssuer.issueFor(user);

        logger.info({ userId: user.id }, 'A new user session has been created');

        return f.successV({ accessToken: accessToken, rotateToken: '' });
    }

    createTempSession = (cmd: { fingerprint: string }) => {

    }
}