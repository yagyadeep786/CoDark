import puppeteer from 'puppeteer';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.get("/api", async (req, res) => {
    const url = req.query.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const texts = await page.$$eval("*", (elements) =>
        elements.map((element) => element.textContent)
    );
    console.log(texts);
    await browser.close();
    res.json({ texts });
});

app.listen(3000);