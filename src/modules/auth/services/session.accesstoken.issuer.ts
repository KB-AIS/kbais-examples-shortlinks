import { VerifyErrors } from "jsonwebtoken";
import { EitherV } from "~sl-core/results/core.result";
import { User, UserKind } from "~sl-modules/users";

export interface SessionPayload {
    userkind: UserKind,
    username: string
}

export interface ISessionAccessTokenIssuer {
    issueFor(user: User): string;

    decode(accessToken: string): Promise<EitherV<SessionPayload, VerifyErrors>>;
}
