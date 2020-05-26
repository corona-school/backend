import { createHash } from "crypto";
import * as bcrypt from "bcrypt";

export function hashToken(input: string): string {
    const hash = createHash("sha512");
    return hash.update(input).digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, bcrypt.genSaltSync(8));
}
