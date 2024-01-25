import { getUserRepository } from '~sl-modules/users';
import { AuthService } from './services/auth.service';
import { BcryptPasswordHasher } from './services/impl/password.bcrypt.hasher';
import { JwtSessionAccessTokenIssuer } from './services/impl/session.accesstoken.jwt.issuer';

export const accessTokenIssuer = new JwtSessionAccessTokenIssuer();

export const passwordHasher = new BcryptPasswordHasher();

export const getAuthService = (): AuthService =>
    new AuthService(getUserRepository(), passwordHasher, accessTokenIssuer);

export { AuthServiceError } from './services/auth.service';
