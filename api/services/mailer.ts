import * as nodemailer from 'nodemailer'
import EmailTemplate from '../views/email'
import * as React from 'react'
import * as ReactDomServer from 'react-dom/server'
import * as juice from 'juice'

export const sendMail = async () => {

    nodemailer.createTestAccount((err, account) => {
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: account.user,
                pass: account.pass
            }
        })
        const html = ReactDomServer.renderToString(EmailTemplate({
            type: 'success',
            heading: 'This is the header',
            body: 'This is getting rendered booyah!',
            linkTitle: "Test link",
            linkUrl: "http://tojam.ca"
        }))
        const finalHtml = juice(html)
        const mailOptions = {
            to: 'tester1@gmail.com',
            from: 'tester2@gmail.com',
            text: 'plain text here',
            subject: 'Hello ✔',
            html: finalHtml
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    })
}