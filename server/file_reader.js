import fs from 'fs';

function removeSpecialCharacters(str) {
    // Use a regular expression to replace special characters with an empty string
    return str.replace(/[^\w\s]/gi, '');
}

function jsonToPlainText(jsonFilePath) {
    try {
        // Read the JSON file
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');

        // Parse the JSON data
        const jsonObject = JSON.parse(jsonData);

        // Convert JSON object to plain text (modify this based on your needs)
        const plainText = JSON.stringify(jsonObject, null, 2);

        return plainText;
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error.message);
        return null;
    }
}

const runFileReadProcess = () => {
    return new Promise((resolve, reject) => {
        // start point 
        const jsonFilePath = './scraped.json';
        const plainTextResult = removeSpecialCharacters(jsonToPlainText(jsonFilePath));

        if (plainTextResult !== null) {
            const outputFilePath = 'output.txt';

            // Write the plain text result to a file
            fs.writeFileSync(outputFilePath, plainTextResult, 'utf8');
            console.log('File saved successfully:', outputFilePath);
            resolve(outputFilePath);
        } else {
            console.error('Error occurred while processing the file');
            const error = "error faced";
            resolve(error);
        }
    });
};

export default { runFileReadProcess };