import puppeteer from 'puppeteer';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());
app.get('/', async (req: Request, res: Response) => {

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('https://support.giva.co/support/home', { waitUntil: 'domcontentloaded' });

        const PageContent: string[] = [];

        const links = await page.$$eval('a', (elements) =>
            elements.map((el) => ({
                text: el.textContent?.trim() || '',
                href: el.href,
            }))
        );
        for (const eachlink of links) {
            try {
                await page.goto(eachlink.href, { waitUntil: 'domcontentloaded' });
                const content = await page.evaluate(() => {
                    return document.body.innerText;
                });
                console.log(`Scraped: ${eachlink.href}`);
                PageContent.push(content);
            } catch (error) {
                console.warn(`Failed to scrape ${eachlink.href}:`, error);
            }
        }
        console.log("Total Pages Scraped:", PageContent.length);
        console.log("Page Content:", PageContent);
        await browser.close();

        res.json({ message: 'Scraping completed successfully', data: PageContent });

    } catch (error) {

        console.error('Error during scraping:', error);
        res.status(500).json({ error: 'An error occurred during scraping.' });
    }

}
)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});