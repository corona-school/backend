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
    anmeldung: '"Corona School Team" <anmeldung@corona-school.de>',
    noreply: '"Corona School Team" <noreply@corona-school.de>',
    screening: '"Corona School Team" <screening@corona-school.de>',
    support: '"Corona School Team" <support@corona-school.de>',
    sms: 'CoronaSchoo' // Maximum 11 characters
};

export { mailjetSmtp, DEFAULTSENDERS };
