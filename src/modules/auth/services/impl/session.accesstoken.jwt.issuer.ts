import jwt, { VerifyErrors } from 'jsonwebtoken';
import { EitherV, failureV, successV } from '~sl-core/results/core.result';
import { User, UserKind } from '~sl-modules/users/index';
import { ISessionAccessTokenIssuer, SessionPayload } from '../session.accesstoken.issuer';

export class JwtSessionAccessTokenIssuer implements ISessionAccessTokenIssuer {
    private secretKey = 'VERYVERYVERYVERYVERYSECRETSECRETKEY';

    constructor() {

    }

    // TODO: From Promise
    issueFor = (user: User): string => {
        // TODO: Set session lifetime depends on user-kind
        const jwtOptions = {
            expiresIn: '10m'
        };

        // TODO: Remove const user-kind
        return jwt.sign({ userkind: UserKind.SIGNED, username: user.username, }, this.secretKey, jwtOptions);
    }

    decode = (accessToken: string): Promise<EitherV<SessionPayload, VerifyErrors>> => new Promise((resolve, _) =>
        jwt.verify(accessToken, this.secretKey, (error, decoded) => {
            if (error) {
                return resolve(failureV(error));
            }

            return resolve(successV(decoded as SessionPayload));
        })
    );
}