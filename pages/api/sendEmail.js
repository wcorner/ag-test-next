import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 25,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

async function sendEmail({ name, email, message }) {
    const emailOptions = {
        from: `Grit Agility Test <test@example.com>`,
        to: `${name} - ${email}`,
        subject: 'Demo Email',
        html: `<h1>Message as follows:</h1> ${message}`
    }

    return transporter.sendMail((emailOptions));

}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const emailRes = await sendEmail(req.body);
        if (emailRes.messageId) {
            return res.status(200).json({message: `Email sent successfuly`});
        }

        return res.status(400).json({message: 'Error sending email'});
    }

    return res.status(400).json({message: `Incorrect method: ${req.method}. Did you mean POST?`});
}
