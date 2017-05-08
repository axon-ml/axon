import {SignOptions} from "jsonwebtoken";

export const FRONTEND_BASE_URL = "http://localhost:3001";
export const JWT_SECRET = "the krabby patty secret formula is";
export const JWT_ISSUER = "https://api.axon-ml.io";
export const JWT_SIGN_OPTIONS: SignOptions = {
    algorithm: "HS256",
    expiresIn: "24h",
    issuer: JWT_ISSUER,
};
