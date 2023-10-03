import express, { Request, Response } from 'express'
import env from 'dotenv'
import cors, { CorsOptions } from 'cors'
import mongoose from 'mongoose'
import fs from 'fs'
// @ts-ignore
import Arturverse from './artifacts/contracts/Arturverse/Arturvers.json'
import { ethers } from 'ethers'
import upload from './utils/fileStorage'
import { File, NFTStorage } from 'nft.storage'
import path from 'path'
import mime from 'mime'
import { customAlphabet, nanoid } from 'nanoid'
import { sendMail } from './utils/mailSender'
import { generateCor } from './utils/generateCor'
env.config()


const corsOptions: CorsOptions = {
    origin: "*"
}
const PORT = process.env.PORT || 4000

const app = express()
app.use(express.static(path.join(__dirname, 'public')));
// @ts-ignore
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 })
 .then(() => console.log('database  is connected'))
 .catch(err => console.log(err))

const fileFromPath = async (filePath: string) => {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type: type as string })
}

const storeNFT = async (
    req: Request,
    external_link: string
    ) => {
    // load the file from disk
    const image = await fileFromPath(req.file?.path as string)
    const nft = {
        image,
        name: req.body.name,
        description: `${req.body.description}\n\n|  |  |\n| ----- | ------ |\n| **Artist** | ${req.body.artist} |\n| **Medium** | ${req.body.medium} |\n| **Material** | ${req.body.material} |\n| **Date** | ${req.body.date} |\n| **Dimensions** | ${req.body.size} |\n| **Copies** | ${req.body.rarity} |\n| **Recognition** | [COA](${req.body.coa}) |`,
        external_link,
        // animation_url: req.body.coa
    }

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY as string })

    // call client.store, passing in the image & metadata
    return nftstorage.store(nft)
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

app.get('/', async(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.post('/api/certificate', upload.single('file'), async (req: Request, res: Response) => {
   try {
    
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`)
    const wallet = new ethers.Wallet(process.env.SECRET_KEY as string)
    const signer =  wallet.connect(provider)
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS as string, Arturverse.abi, signer)

     const customToken = customAlphabet('1234567890', 10)
     const tokenId = parseInt(customToken())
     const redeemId = nanoid()
     const external_link = `https://arturverse-frontend.vercel.app/nft/${tokenId}`
     if(!req.file) return res.status(400).send({ error: "Certificate image not valid" })
     const tokenUri = await storeNFT(
    req,
    external_link
    )
  // await generateCor()

    

     
    await contract.mintCertificate(redeemId, tokenUri.url, tokenId)
    const result = await fetch(`https://nftstorage.link/ipfs/${tokenUri.url.replace('ipfs://','')}`)
    const data = await result.json()
    await sendMail(req.body.email, redeemId, tokenId, req, data.image.replace('ipfs://', 'https://nftstorage.link/ipfs/'))
     res.status(200).json({
        tokenUri,
        tokenId,
        redeemId
     })
     
   } catch (error: any) {
    console.log(error);
    
      res.status(500).send({error: error})
   }
})


app.listen(PORT, async () => {
  console.log('listening on port ', PORT)
})


