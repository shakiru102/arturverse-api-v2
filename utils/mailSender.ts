import Mailgun from "mailgun.js";
import formData from 'form-data';
const mailgun = new Mailgun(formData);

export const sendMail = async (to: string, redeemId: string, tokenId: number) => {
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_APIKEY as string,
    });
    const { status, message } =  await mg.messages
                .create(process.env.MAILGUN_DOMAIN as string, {
                    from: process.env.FROM_MAIL as string,
                    to,
                    subject: "ARTURVERSE CERTIFICATE",
                       html: `
                            <!doctype html>
                            <html>
                                <head>
                                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                                </head>
                                <body style="font-family: sans-serif;">
                                <div style="display: block; margin: auto; max-width: 600px;" class="main">
                                    <h1 style="font-size: 18px; margin-top: 20px">CERTIFICATE ID:  <strong>${tokenId}</strong></h1>
                                    <p style="font-size: 14px; margin-top: 20px">Redeem your certificate using: <strong>${redeemId}</strong></p>
                                    <p>View your certificate on this platforms: </p>
                                    <div><a href="https://arturverse-frontend.vercel.app/nft/${tokenId}">arturverse-frontend.vercel.app/nft/${tokenId}</a></div>
                                    <div><a href="https://testnets.opensea.io/assets/sepolia/${process.env.CONTRACT_ADDRESS}/${tokenId}">testnets.opensea.io/assets/sepolia/${process.env.CONTRACT_ADDRESS}/${tokenId}</a></div>
                                    
                                    <p>Thank you.</p>
                                </div>
                                <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
                                <style>
                                    .main { background-color: white; }
                                    a:hover { border-left-width: 1em; min-height: 2em; }
                                </style>
                                </body>
                            </html>
                        
                            `
                })
        return { status, message }
}