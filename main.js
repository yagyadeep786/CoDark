document
  .getElementById("extract-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const url = document.getElementById("url-input").value;
    const resBox = document.getElementById("responseData");
    const loader = document.getElementById("loader");

    // Show the loader while fetching data
    loader.style.display = "block";

    fetch(`http://localhost:3000/?url=${encodeURIComponent(url)}`)
      .then((response) => response.json())
      .then((data) => {
        
        // Assuming data.pythonOutput contains the string with dark pattern occurrences
        console.log(data);
        // const darkPatternData = data.pythonOutput; //yagya
        const darkPatternData= JSON.stringify(data.pythonOutput);// add yagya
        resBox.innerText = darkPatternData;

        // // Parse dark pattern data to extract occurrences
        // const darkPatternOccurrences =
        //   parseDarkPatternOccurrences(darkPatternData);

        // // Calculate the total occurrences
        // const totalOccurrences = calculateTotalOccurrences(
        //   darkPatternOccurrences
        // );

        // const formattedOutput = Object.entries(darkPatternData).join("\n");

        // // Update the meter and display the percentages
        // document.getElementById("gauge").value =
        //   (darkPatternOccurrences / totalOccurrences) * 100 || 0;
        // document.getElementById(
        //   "value-status"
        // ).innerText = `${darkPatternOccurrences.toFixed(
        //   2
        // )}% Dark Pattern Found`;

        // Hide the loader after fetching data
        loader.style.display = "none";
      })
      .catch((error) => {
        // console.error("Error:", error);
        // Hide the loader in case of an error
        loader.style.display = "none";
      });
  });

// // Function to parse dark pattern occurrences from the string
// function parseDarkPatternOccurrences(data) {
//   // Split the data into lines
//   const lines = data.split("\n");

//   // Initialize the dark pattern occurrences variable
//   let darkPatternOccurrences = 0;

//   // Iterate through each line and extract occurrences
//   lines.forEach((line) => {
//     // Split each line into words
//     const words = line.split(" ");

//     // Check if the line contains occurrences information
//     if (words.length >= 2 && !isNaN(parseInt(words[1]))) {
//       // Extract the occurrence count
//       darkPatternOccurrences += parseInt(words[1], 10) || 0;
//     }
//   });

//   return darkPatternOccurrences;
// }

// // Function to calculate the total occurrences
// function calculateTotalOccurrences(darkPatternOccurrences) {
//   return darkPatternOccurrences;
// }
