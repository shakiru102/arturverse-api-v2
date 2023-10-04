FROM ghcr.io/puppeteer/puppeteer:21.3.6

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    MONGO_URI=mongodb+srv://SAS1099:olashekoni@cluster0.hqgww.mongodb.net/Arturverse?retryWrites=true&w=majority \
    CONTRACT_ADDRESS=0x4e7e01012Fc2Cba11490478c941Ef79d3F86685C \
    SECRET_KEY=b69d343c46242e05438eded1a7e08d24bc83dddcd923806d36c01886dc19b101 \
    API_KEY=ngABC3wIt249dDdjZIPN9l0z9dydTQal \
    CLOUDINARY_CLOUD_NAME=sas1999 \
    CLOUDINARY_API_KEY=381973934242834 \
    CLOUDINARY_API_SECRET=CVYtueuCKWE2Jm3xU1qEEtIHkvc \
    NFT_STORAGE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4MDg5YkQyZTJBNTQ4YTY4NTYwNTMxNzAzMzIwMTQ5ZGU4MTYxMzEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5MzUwNDc2MzM2OCwibmFtZSI6IkFydHVydmVyc2UifQ.XzkZ7ZSEsh3T8gSXidYNBqpSWIkeHu6mYlAjwK_YkTo \
    FROM_MAIL=sshekoni@claritae.com \
    MAILGUN_DOMAIN=sandboxd9c8b437acbf46ca97dd36e9da01bcc8.mailgun.org \
    MAILGUN_APIKEY=e080a3d1659bd195f8f1a602e23f006a-451410ff-9573d2bc \
    APP_LINK=https://arturverse-api.onrender.com 

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]   