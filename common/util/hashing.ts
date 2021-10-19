import { createHash } from "crypto";
import bcrypt from "bcrypt";

export function hashToken(input: string, algorithm : string = "sha512"): string {
    const hash = createHash(algorithm);
    return hash.update(input).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(8));
}

// Barely in sync with https://github.com/corona-school/backend-screening/blob/master/src/auth.ts
// Dropped PHP interop, we might want to reset these passwords anyways
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}