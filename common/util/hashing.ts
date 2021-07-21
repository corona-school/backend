import { createHash } from "crypto";
import bcrypt from "bcrypt";

export function hashToken(input: string, algorithm : string = "sha512"): string {
    const hash = createHash(algorithm);
    return hash.update(input).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(8));
}
