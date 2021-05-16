export function generateStatusChangeURLFromToken(token: string, confirmed: boolean) {
    return `https://my.lern-fair.de/confirm?token=${token}&confirmed=${confirmed ? "true" : "false"}`;
}