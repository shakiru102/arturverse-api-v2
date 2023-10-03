import Mailgun from "mailgun.js";
import formData from 'form-data';
const mailgun = new Mailgun(formData);
import qr from 'qrcode'
import fs from 'fs'
import { generateCor } from "./generateCor";
import { Request } from "express";
import { designCoa } from "./designCoa";

export const sendMail = async (to: string, redeemId: string, tokenId: number, req: Request, nftImage: string) => {
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_APIKEY as string,
    });

    // const data = await qr.toString(`https://arturverse-frontend.vercel.app/nft/${tokenId}`)
    const dataUrl = await qr.toDataURL(`https://arturverse-frontend.vercel.app/nft/${tokenId}`)
    const testNetUrl = await qr.toDataURL(`https://testnets.opensea.io/assets/sepolia/${process.env.CONTRACT_ADDRESS}/${tokenId}`)
    // fs.writeFileSync('qr.txt', data)
    const { 
        name,
        artist,
        medium,
        material,
        date,
        size,
        rarity
     } = req.body
   designCoa(name, artist, size, material, medium, date, rarity, testNetUrl, req.file?.path as string, nftImage)
   await generateCor()
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
                        
                            `,
                            attachment: [
                                {
                                    filename: 'coa.pdf',
                                    data: fs.readFileSync('coa.pdf')
                                }
                            ]
                })
                // fs.unlinkSync('coa.pdf')
        return { status, message }
}