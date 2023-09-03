import express, { Request, Response } from 'express'
import env from 'dotenv'
import cors, { CorsOptions } from 'cors'
import mongoose from 'mongoose'
import fs from 'fs'
// @ts-ignore
import Arturverse from '.artifacts/contracts/Arturverse/Arturvers.json'
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

const storeNFT = async (imagePath: string, name: string, description: string) => {
    // load the file from disk
    const image = await fileFromPath(imagePath)

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY as string })

    // call client.store, passing in the image & metadata
    return nftstorage.store({
        image,
        name,
        description,
    })
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
     if(!req.file) return res.status(400).send({ error: "Certificate image not valid" })
     const tokenUri = await storeNFT(req.file.path, req.body.name, req.body.description)
    await sendMail(req.body.email, redeemId, tokenId)
    // await client
    //  .send({
    //    from: sender as any,
    //    to: [{ email:  req.body.email}],
    //    subject: "ARTURVERSE CERTIFICATE",
    
    //  })
     
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
