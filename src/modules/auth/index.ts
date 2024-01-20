import { getUserRepository } from '~sl-modules/users';
import { AuthService, AuthServiceError } from './services/auth.service';
import { BcryptPasswordHasher } from './services/impl/password.bcrypt.hasher';
import { JwtSessionAccessTokenIssuer } from './services/impl/session.accesstoken.jwt.issuer';

export const getAuthService = (): AuthService =>
    new AuthService(
        getUserRepository(),
        new BcryptPasswordHasher(),
        new JwtSessionAccessTokenIssuer()
    );

export { AuthServiceError };

