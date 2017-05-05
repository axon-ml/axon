import {SignOptions} from "jsonwebtoken";

export const FRONTEND_BASE_URL: string = "http://localhost:3001";
export const JWT_SECRET: string = "the krabby patty secret formula is";
export const JWT_ISSUER: string = "https://api.axon-ml.io";
export const JWT_SIGN_OPTIONS: SignOptions = {
    algorithm: "HS256",
    expiresIn: "24h",
    issuer: JWT_ISSUER,
};
