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
    anmeldung: '"Lern-Fair Team" <anmeldung@corona-school.de>',
    noreply: '"Lern-Fair Team" <noreply@corona-school.de>',
    screening: '"Lern-Fair Team" <screening@corona-school.de>',
    support: '"Lern-Fair Team" <support@corona-school.de>'
};

export { mailjetSmtp, DEFAULTSENDERS };
