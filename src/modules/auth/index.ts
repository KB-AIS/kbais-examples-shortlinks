import { userRepository } from '~sl-modules/users';
import { AuthService, AuthServiceError } from './services/auth.service';
import { BcryptPasswordHasher } from './services/impl/password.bcrypt.hasher';
import { JwtSessionAccessTokenIssuer } from './services/impl/session.accesstoken.jwt.issuer';

const authService = new AuthService(
    userRepository,
    new BcryptPasswordHasher(),
    new JwtSessionAccessTokenIssuer()
);

export {
    authService,
    AuthServiceError
};

