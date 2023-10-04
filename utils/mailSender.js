"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const form_data_1 = __importDefault(require("form-data"));
const mailgun = new mailgun_js_1.default(form_data_1.default);
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const generateCor_1 = require("./generateCor");
const designCoa_1 = require("./designCoa");
const sendMail = (to, redeemId, tokenId, req, nftImage) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_APIKEY,
    });
    // const data = await qr.toString(`https://arturverse-frontend.vercel.app/nft/${tokenId}`)
    const dataUrl = yield qrcode_1.default.toDataURL(`https://arturverse-frontend.vercel.app/nft/${tokenId}`);
    const testNetUrl = yield qrcode_1.default.toDataURL(`https://testnets.opensea.io/assets/sepolia/${process.env.CONTRACT_ADDRESS}/${tokenId}`);
    // fs.writeFileSync('qr.txt', data)
    const { name, artist, medium, material, date, size, rarity } = req.body;
    (0, designCoa_1.designCoa)(name, artist, size, material, medium, date, rarity, testNetUrl, (_a = req.file) === null || _a === void 0 ? void 0 : _a.path, nftImage);
    yield (0, generateCor_1.generateCor)();
    const { status, message } = yield mg.messages
        .create(process.env.MAILGUN_DOMAIN, {
        from: process.env.FROM_MAIL,
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
                data: fs_1.default.readFileSync('public/coa.pdf')
            }
        ]
    });
    // fs.unlinkSync('coa.pdf')
    return { status, message };
});
exports.sendMail = sendMail;
