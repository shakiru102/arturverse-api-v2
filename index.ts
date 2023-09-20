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
env.config()


const corsOptions: CorsOptions = {
    origin: "*"
}
const PORT = process.env.PORT || 4000

const app = express()
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
    // const image = await fileFromPath(req.file?.path as string)
    const image = await fileFromPath('qr.txt')
    const nft = {
        image,
        name: req.body.name,
        description: req.body.description,
        attributes: [
            {
                "trait_type": "Material",
                "value": req.body.material.toString() || "none"
            },
            {
                "trait_type": "Size",
                "value": req.body.size.toString() || "none"
            },
            {
                "trait_type": "Rarity",
                "value": req.body.rarity.toString() || "none"
            },
            {
                "trait_type": "Medium",
                "value": req.body.medium.toString() || "none"
            },
            {
                "trait_type": "Signature",
                "value": req.body.signature.toString() || "none"
            },
            {
                "trait_type": "Artist",
                "value": `${req.body.artist}` || "none"
            },
            {
                "trait_type": "COA",
                "value": req.body.coa.toString() || "none"
            },
        ],
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

app.get('/', async (req: Request, res: Response) => {
 try {
    const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.API_KEY}`)
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS as string, Arturverse.abi, provider)
    const getAsset = await contract.owner()
      res.status(200).json(getAsset)
 } catch (error: any) {
    res.send({error: error.message})
 }
})

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
    //  if(!req.file) return res.status(400).send({ error: "Certificate image not valid" })
     const tokenUri = await storeNFT(
    req,
    external_link
    )
    await sendMail(req.body.email, redeemId, tokenId)

     
    await contract.mintCertificate(redeemId, tokenUri.url, tokenId)
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


app.listen(PORT, () => console.log('listening on port ', PORT))
