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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
// @ts-ignore
const Arturvers_json_1 = __importDefault(require("./artifacts/contracts/Arturverse/Arturvers.json"));
const ethers_1 = require("ethers");
const fileStorage_1 = __importDefault(require("./utils/fileStorage"));
const nft_storage_1 = require("nft.storage");
const path_1 = __importDefault(require("path"));
const mime_1 = __importDefault(require("mime"));
const nanoid_1 = require("nanoid");
const mailSender_1 = require("./utils/mailSender");
dotenv_1.default.config();
const corsOptions = {
    origin: "*"
};
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// @ts-ignore
mongoose_1.default.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('database  is connected'))
    .catch(err => console.log(err));
const fileFromPath = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield fs_1.default.promises.readFile(filePath);
    const type = mime_1.default.getType(filePath);
    return new nft_storage_1.File([content], path_1.default.basename(filePath), { type: type });
});
const storeNFT = (req, external_link) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // load the file from disk
    const image = yield fileFromPath((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
    const nft = {
        image,
        name: req.body.name,
        description: `${req.body.description}\n\n|  |  |\n| ----- | ------ |\n| **Artist** | ${req.body.artist} |\n| **Medium** | ${req.body.medium} |\n| **Material** | ${req.body.material} |\n| **Date** | ${req.body.date} |\n| **Dimensions** | ${req.body.size} |\n| **Copies** | ${req.body.rarity} |\n| **Recognition** | [COA](${req.body.coa}) |`,
        external_link
        // animation_url: req.body.coa
    };
    // create a new NFTStorage client using our API key
    const nftstorage = new nft_storage_1.NFTStorage({ token: process.env.NFT_STORAGE_KEY });
    // call client.store, passing in the image & metadata
    return nftstorage.store(nft);
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(corsOptions));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
}));
app.post('/api/certificate', fileStorage_1.default.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const provider = new ethers_1.ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`);
        const wallet = new ethers_1.ethers.Wallet(process.env.SECRET_KEY);
        const signer = wallet.connect(provider);
        const contract = new ethers_1.ethers.Contract(process.env.CONTRACT_ADDRESS, Arturvers_json_1.default.abi, signer);
        const customToken = (0, nanoid_1.customAlphabet)('1234567890', 10);
        const tokenId = parseInt(customToken());
        const redeemId = (0, nanoid_1.nanoid)();
        const external_link = `https://arturverse-frontend.vercel.app/nft/${tokenId}`;
        if (!req.file)
            return res.status(400).send({ error: "Certificate image not valid" });
        const tokenUri = yield storeNFT(req, external_link);
        // await generateCor()
        yield contract.mintCertificate(redeemId, tokenUri.url, tokenId);
        const result = yield fetch(`https://nftstorage.link/ipfs/${tokenUri.url.replace('ipfs://', '')}`);
        const data = yield result.json();
        yield (0, mailSender_1.sendMail)(req.body.email, redeemId, tokenId, req, data.image.replace('ipfs://', 'https://nftstorage.link/ipfs/'));
        // fs.writeFileSync('public/index.html', 'server is running')
        // fs.unlinkSync('coa.pdf')
        res.status(200).json({
            tokenUri,
            tokenId,
            redeemId
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: error });
    }
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('listening on port ', PORT);
}));
