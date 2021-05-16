const mailjetSmtp = {
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAILJET_USER,
        pass: process.env.MAILJET_PASSWORD
    },
    tls: {
        ciphers: "SSLv3"
    }
};

const DEFAULTSENDERS = {
    anmeldung: '"Lern-Fair Team" <anmeldung@lern-fair.de>',
    noreply: '"Lern-Fair Team" <noreply@lern-fair.de>',
    screening: '"Lern-Fair Team" <screening@lern-fair.de>',
    support: '"Lern-Fair Team" <support@lern-fair.de>'
};

export { mailjetSmtp, DEFAULTSENDERS };
