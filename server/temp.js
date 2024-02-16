import puppeteer from "puppeteer";
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import fileReader from "./file_reader.js";
import pythonFile from "./pythonCall.js";

const app = express();

app.use(cors());
app.use(express.json());

const processUrl = async (url, res) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);

    const special_characters =
      /[\[\],"\{\}\(\)\<\>\/\?;\:|\`~\!\@\#\$\%\^\&\*\_\-\+\=\.\n\t ]/g;

    const texts = await page.$$eval(
      "p, h1, h2, h3, h4, h5, h6, li, a",
      (elements, special_characters) =>
        elements
          .map((element) => element.textContent.replace(special_characters, ""))
          .filter(
            (text) =>
              text.trim() !== "" &&
              text !== '""' &&
              text !== "\n\t\t\t\t\\n\t\t\t\t"
          ), // Remove empty strings and specific strings
      special_characters
    );

    await browser.close();

    // Write to scraped.json
    const jsonPath = "./scraped.json";
    const jsonData = JSON.stringify(texts, null, 2);
    await fs.writeFile(jsonPath, jsonData, "utf8");

    // Run file clean process
    await fileCleanProcess();

    // Call the Python process
    const pythonOutput = await pythonFile.runPythonProcess();

    res.json({
      texts,
      pythonOutput,
      message: `Output returned from python file: ${pythonOutput}`,
    });
  } catch (error) {
    console.error("Error:", error);
    // Ensure no further code is executed after sending a response
    return res.status(500).send("Internal Server Error");
  }
};

const fileCleanProcess = async () => {
  try {
    const fileCleanOutput = await fileReader.runFileReadProcess();
    console.log("running file clean process");
    if (fileCleanOutput === "error faced") {
      console.log("error faced");
    } else {
      console.log("file clean process completed");
    }
  } catch (error) {
    console.error(error);
    throw new Error("File clean process failed");
  }
};

app.get("/", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("Bad Request: URL parameter is missing");
  }

  // Process the URL and run the model
  await processUrl(url, res);
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000");
});
