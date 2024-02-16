import puppeteer from "puppeteer";
import express from "express";
import cors from "cors";
import fs from "fs";
import fileReader from "./file_reader.js";
import pythonFile from "./pythonCall.js";
import {createWorker} from "tesseract.js"
const app = express();

app.use(cors());
app.use(express.json());

const processUrl = async (url, res) => {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url);

    const special_characters =
      /[\[\],"\{\}\(\)\<\>\/\?;\:|\`~\!\@\#\$\%\^\&\*\_\-\+\=\.\n\t ]/g;
    
    const texts = await page.$$eval("p, h1, h2, h3, h4, h5, h6, li, a, span, div", elements => {
      const allElements = [];
      
      elements.forEach(element => {
        const hasTextOnly = Array.from(element.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
        
        if (hasTextOnly && element.textContent !== "") {
          allElements.push(element.textContent);
        }
      });
  
      return allElements;
    });
    const imagesPaths = await page.$$eval(
      "img",
      (elements) =>
        elements
          .map((element) =>{ 
            if(!element.src.includes("data:")){
              return element.src;
            }
        }) 
    );

// processImages(imagesPaths)
//   .then(texts => {
//       // console.log("Text extracted from images:");
//       texts.forEach((text, index) => {
//           // console.log(`Image ${index + 1}: ${text}`);
//       });
//   })
//   .catch(err => {
//       console.error("Error processing images:", err);
//   });

    // console.log(texts);
    await browser.close();

    // Run file clean process
    fileCleanProcess(texts); // await add kar dena

    // Call the Python process
    await pythonFile.runPythonProcess();
    // console.log("file is working");
   var pythonOutput= fs.readFileSync("./data.json");
   if(pythonOutput != ""){
    // console.log(pythonOutput.toString(), "pythonOutput");
    pythonOutput= pythonOutput.toString();
    res.json({
      texts,
      pythonOutput,
      message: `Output returned from python file: ${pythonOutput}`,
    });
   }
  } catch (error) {
    console.error("Error:", error);
    // Ensure no further code is executed after sending a response
    return res.status(500).send("Internal Server Error");
  }
};

async function processImage(imagePath) {
  const worker = await createWorker("eng");
  const { data: { text } } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
}

// Function to process multiple images
async function processImages(imagePaths) {
  // console.log(imagePaths);
  const texts = [];

  for (const imagePath of imagePaths) {
    if(imagePath != null && imagePath != "" && !imagePath.includes(".svg")){
      // console.log(imagePath);
      var text = await processImage(imagePath);
      text= removeSpecialCharactersAndSpaces(text);
      // console.log("this is image text: ",text); //here show the output
      fs.writeFileSync("./output.txt",text,{flag:"a"});
      texts.push(text);
    }
  }
  return texts;
}

// Example usage

function removeSpecialCharactersAndSpaces(text) {
  // Define the regular expression pattern to match special characters and consecutive spaces
  const pattern = /[^a-zA-Z0-9\s]|(\s\s+)/g; 
  // Matches any character that is not alphanumeric or whitespace, or consecutive spaces
  
  // Use the replace() method to replace matched special characters and spaces with a single space
  const pureText = text.replace(pattern, ' ').trim(); // Trim to remove leading and trailing spaces
  
  return pureText;
}

const fileCleanProcess = (texts) => {
  try {
    const cleanedTexts = texts.join("\n");
    const filePath = "./output.txt";
    fs.writeFileSync(filePath, cleanedTexts, "utf8");
    console.log("File clean process completed");
  } catch (error) {
    console.error(error);
    throw new Error("File clean process failed");
  }
};

app.get("/", async (req, res) => {
  const url = req.query.url;
  console.log(url);
  if (!url) {
    return res.status(400).send("Bad Request: URL parameter is missing");
  }

  // Process the URL and run the model
  await processUrl(url, res);
});

app.listen(3000, () => {
  console.log("Server running on port http://localhost:3000");
});
