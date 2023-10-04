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
exports.generateCor = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const generateCor = (
// imagePath: string, 
// req: Request, 
// redeemId: string, 
// tokenId: number
) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a browser instance
    const browser = yield puppeteer_1.default.launch({
        headless: 'new',
        executablePath: process.env.NODE_ENV === 'production' ?
            process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer_1.default.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--single-process',
            '--no-zygote'
        ]
    });
    // Create a new page
    const page = yield browser.newPage();
    // Website URL to export as pdf
    const website_url = process.env.APP_LINK || 'http://localhost:4000/';
    // Open URL in current page
    yield page.goto(website_url, { waitUntil: 'networkidle0' });
    //To reflect CSS used for screens instead of print
    yield page.emulateMediaType('screen');
    // Downlaod the PDF
    const pdf = yield page.pdf({
        path: 'public/coa.pdf',
        margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
        printBackground: true,
        format: 'A4',
    });
    // Close the browser instance
    yield browser.close();
});
exports.generateCor = generateCor;
