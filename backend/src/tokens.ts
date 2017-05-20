import * as crypto from "crypto";
import {HMAC_ALGO, TOKEN_SECRET} from "./constants";

export interface Claim {
    userId: string;
    iss: Date;
}

/**
 * An encapsulated claim with a signature.
 */
export interface Token {
    claim: Claim;
    sig: string;
}

export function verify(token: Token): boolean {
    const hmac = crypto.createHmac(HMAC_ALGO, TOKEN_SECRET);
    const claim = JSON.stringify(token.claim);
    const trueDigest = hmac.update(claim).digest("hex");
    return trueDigest === token.sig;
}

export function createToken(claim: Claim): Token {
    const hmac = crypto.createHmac(HMAC_ALGO, TOKEN_SECRET);
    const sig = hmac.update(JSON.stringify(claim)).digest("hex");
    return {
        claim: claim,
        sig: sig,
    };
}
