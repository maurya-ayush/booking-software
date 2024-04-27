import { jwtVerify } from "jose";

export interface UserJwtpayload {
    jti: string;
    iat: number;
}
export function getJwtSecretKey(): string {
    const secret = process.env.JWT_SECRET_KEY;

    if (!secret || secret.length === 0) {
        throw new Error("JWT_SECRET_KEY is not set");
    }
    return secret;
}

export const verifyAuth = async (token: string) => {
    try {
        const verified = await jwtVerify(token, new TextEncoder().encode(getJwtSecretKey()));
        return verified.payload as UserJwtpayload;
    } catch (error) {
        throw new Error("Invalid token");
    }
};