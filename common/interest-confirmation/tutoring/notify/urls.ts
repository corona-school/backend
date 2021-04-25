export function generateStatusChangeURLFromToken(token: string, confirmed: boolean) {
    return `https://my.corona-school.de/confirm?token=${token}&confirmed=${confirmed ? "true" : "false"}`;
}