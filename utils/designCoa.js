"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.designCoa = void 0;
const fs_1 = __importDefault(require("fs"));
const designCoa = (name, artist, size, material, medium, date, rarity, qrcode, image, nftImage) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Authenticity</title>
    <style>
        .frame {
            width: 100%;
            position: absolute;
            z-index: 0;
            height: 700px;
        }
        main {
            width: 85%;
            margin: 8em auto;
            /* border: 1px solid rgba(128, 128, 128, 0.798); */
            border-radius: 20px;
            padding: 28px 10px;
            position: relative;
            top: 6em;
            

        }
        section.container {
            display: flex;
            flex-direction: row;
            text-align: right;
            
        }

        section div.art-details {
            flex: 2;
        }
        section div.art-image {
            flex: 1;
        }
        .field {
            display: flex;
            margin: 28px 0;
        }
        .field span {
            /* flex: 1; */
        }
        .enteries {
          flex: 1;
          border-bottom: 1px solid rgba(128, 128, 128, 0.41);
          text-align: center;
        }
        .art-image {
            display: flex;
            flex-direction: column;
            padding-top: 1em;
            /* justify-content: center; */
            align-items: end;
        }
        .image-style {
            border-radius: 20px;
        }
        .qrcode {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2em;
            justify-content: center;
            margin-right: 3em;
        }

    </style>
</head>
<body>
        <img class="frame" src="./fiver_COA_Shim.png" alt="bg">
   <main>
    <section class="container">
        <div class="art-details">
            <div class="field">
                <span>Artwork Title:</span>
                <span class="enteries">${name}</span>
            </div>
            <div class="field">
                <span>Creator Name:</span>
                <span class="enteries">${artist}</span>
            </div>
            <div class="field">
                <span>Dimension:</span>
                <span class="enteries">${size}</span>
            </div>
            <div class="field">
                <span>Material:</span>
                <span class="enteries">${material}</span>
            </div>
            <div class="field">
                <span>Medium:</span>
                <span class="enteries">${medium}</span>
            </div>
            <div class="field">
                <span>Creation Date:</span>
                <span class="enteries">${date}</span>
            </div>
            <div class="field">
                <span>Rarity:</span>
                <span class="enteries">${rarity}</span>
            </div>
        </div>
        <div class="art-image">
           <img  width="200px" class="image-style" height=200px" src="${nftImage}" alt="artwork"> 
           <div class="qrcode">
            <img width="80px" height="80px"  src="${qrcode}" alt="qrcode">   
            SCAN ME 
           </div> 
        </div>
   </section>
   <section style="text-align: center; font-size: 20px; width: 90%; margin:2em auto ;">
    This artwork here described is a one of a kind original all copyright and reproduction are reserved 
   </section>
   </main>
</body>
</html>`;
    fs_1.default.writeFileSync('public/index.html', html);
};
exports.designCoa = designCoa;
