import jwt from 'jsonwebtoken';
import { User } from '~sl-modules/users/index';
import { ISessionAccessTokenIssuer, SessionPayload } from '../session.accesstoken.issuer';


export class JwtSessionAccessTokenIssuer implements ISessionAccessTokenIssuer {
    private secretKey = 'VERYVERYVERYVERYVERYSECRETSECRETKEY';

    constructor() {

    }

    issueFor(user: User): string {
        const accessToken = jwt.sign(
            {
                username: user.username,
            },
            // TODO: Get from configuration
            this.secretKey,
            {
                expiresIn: '10m'
            }
        );

        return accessToken;
    }

    decode(accessToken: string): SessionPayload {
        const session = jwt.verify(accessToken, this.secretKey) as SessionPayload;

        return session;
    }
}