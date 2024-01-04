import { User } from "~sl-modules/users";

export interface SessionPayload {
    username: string
}

export interface ISessionAccessTokenIssuer {
    issueFor(user: User): string;

    decode(accessToken: string): SessionPayload;
}
