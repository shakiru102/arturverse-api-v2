import mongoose from "mongoose";
import { CertificateProps } from "../types";

const schema = new mongoose.Schema<CertificateProps>({
   artist: {
    name: {
        type: String
    },
    description: {
        type: String
    }
   },
   description: {
    type: String
   },
   frame: {
    type: String
   },
   image: {
    type: String
   },
   material: {
    type: String
   },
   medium: {
    type: String
   },
   name: {
    type: String
   },
   rarity: {
    type: String
   }
})

const Certificate = mongoose.model<CertificateProps>('certificate', schema)