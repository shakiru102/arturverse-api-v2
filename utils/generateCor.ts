import puppeteer from "puppeteer";

export const generateCor = async (
  // imagePath: string, 
  // req: Request, 
  // redeemId: string, 
  // tokenId: number
  ) => {
    // { 
    //   headless: 'new',
    //   executablePath: process.env.NODE_ENV === 'production' ?
    //     process.env.PUPPETEER_EXECUTABLE_PATH
    //     : puppeteer.executablePath(),
    //     args: [
    //       '--no-sandbox',
    //       '--disable-setuid-sandbox',
    //       '--single-process',
    //       '--no-zygote'
    //     ]
    //  }
  
  // Create a browser instance
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create a new page
  const page = await browser.newPage();

  // Website URL to export as pdf
  const website_url = process.env.APP_LINK || 'http://localhost:4000/'; 

  // Open URL in current page
  await page.goto(website_url, { waitUntil: 'networkidle0' }); 

  //To reflect CSS used for screens instead of print
  await page.emulateMediaType('screen');

// Downlaod the PDF
  const pdf = await page.pdf({
    path: 'public/coa.pdf',
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    printBackground: true,
    format: 'A4',
  });
console.log('ran');

  // Close the browser instance
  await browser.close();

  
} 