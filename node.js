const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

const readCounter = async () => {
  try {
    const counterData = await fs.readFile(
      path.join(__dirname, "longitude.txt"),
      "utf-8"
    );
    return parseInt(counterData.split("=")[1], 10);
  } catch (error) {
    console.error("Error reading counter file:");
    return 0;
  }
};

const updateCounter = async (counter) => {
  try {
    await fs.writeFile(
      path.join(__dirname, "longitude.txt"),
      `counter=${counter}`
    );
    console.log(`Counter successfully updated to ${counter}.`);
  } catch (error) {
    console.error("Error updating counter file:", error);
  }
};
let existingData = [];
const fetchData = async (latitude, longitude) => {
  const url = "https://api.plugshare.com/v3/locations/region";
  const params = {
    access: 1,
    count: 500,
    latitude: latitude,
    longitude: longitude,
    minimal: 0,
    outlets: Array.from({ length: 31 }, (_, i) => ({ connector: i, power: 0 })),
    spanLat: 0.13487949876746086,
    spanLng: 0.2121734619140625,
  };
  const headers = {
    Accept: "*/*",
    Authorization: "Basic d2ViX3YyOkVOanNuUE54NHhXeHVkODU=",
    "Cognito-Authorization":
      "eyJraWQiOiJ4RmIzSVZuTXhYZEhUaWNTN1NJeVNGc3BHOUsydVZ2NUVNT2U4NkQxeHhBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoidmd5cHJfVTBzWUlkWi1ENW9WMzF2USIsInN1YiI6IjNmM2RkYzRjLTEzNWQtNDdjOC1iNmJmLTNjNGQwNmM1ZTc0OSIsImN1c3RvbTpwbHVnc2hhcmVfaWQiOiI1MDg1NDI1IiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX293ZVE3WG1HZl9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX293ZVE3WG1HZiIsImNvZ25pdG86dXNlcm5hbWUiOiJnb29nbGVfMTE1NDE5NDgwNDkyMDczNDAyMDIwIiwiZ2l2ZW5fbmFtZSI6IkFCSEFZIiwicGljdHVyZSI6Imh0dHBzOlwvXC9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tXC9hXC9BQ2c4b2NJNFAta21lV1ctdXRtbURHdGlTNXhrLU1tSVlxSGJhdng3MjdHOHlBQmphcEtZaTlqZD1zOTYtYyIsImF1ZCI6IjJ1MHFpM3IwZWtjM2huc2wycnNnMzExY2kiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiIxMTU0MTk0ODA0OTIwNzM0MDIwMjAiLCJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiJHb29nbGUiLCJpc3N1ZXIiOm51bGwsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNzEyOTE3OTE4Nzg5In1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxNjAzODIyNCwibmFtZSI6IkFCSEFZIEtVTUFSIiwiZXhwIjoxNzE2MDQxODI3LCJpYXQiOjE3MTYwMzgyMjcsImVtYWlsIjoiYWtiazA0QGdtYWlsLmNvbSJ9.AF1RPO2dvebXH-uKxuMdSTT-XVNnLm10OX0Uef4iu9iZM8To2WWF6Fo3vPAxy0D6OsYBPI1iSJTUu4QLmdDNmeBsSP3xrWDl-PAZAaGXRfjp24ptAZzNkNTJpNCzcnrg9UAQ3y10xfMOnhhCuD6PDIq_AIfLk8Wz-ZzuUUIoUYHeg4U3RpN3CuCwO9fWgHfiDO2Hwm575QVBwW0USWqyyuA8cVt024IF3JpV9Wb0ROUUl7wEK8oy6USXbaLmpXFmBHW3pls6Degw2tLK8J2swj6vzwpR7v_7Be_UuAWaWvXhyPnf6gYhiVm2VzBX9ETuxfi8XIHId3S6T2lhfTxDeQ",

    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  };

  try {
    const response = await axios.get(url, { params, headers });

    // Read existing data from the file

    try {
      const data = await fs.readFile("c.json", "utf-8");
      existingData = JSON.parse(data);
      console.log(data, "this is data");
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error; // If error is not 'file not found', throw it
      }
    }

    // Append new data to existing data
    existingData.push(...response.data);

    // Write updated data back to the file

    console.log(
      `Data saved for latitude: ${latitude}, longitude: ${longitude} ,data ${response.data}`
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const run = async () => {
  try {
    const latitude = parseFloat(await fs.readFile("latitude.txt", "utf8"));
    let longitude = parseFloat(await fs.readFile("longitude.txt", "utf8"));

    await fetchData(latitude, longitude);

    longitude += 0.2121734619140625; // Adjust as needed
    await fs.writeFile("longitude.txt", longitude.toString());

    console.log(`Updated longitude: ${longitude}`);
  } catch (error) {
    console.error("Error in run function:", error);
  }
};

const INTERVAL = 0; // 3 minutes in milliseconds
const REQUESTS = 5;

const start = async (requests) => {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 5; i++) {
      await run();
      await new Promise((resolve) => setTimeout(resolve, INTERVAL));
    }
    await fs.writeFile("e.json", JSON.stringify(existingData, null, 2));
    existingData.length = 0;
    console.log(existingData, "this is existing data");
  }
};

writeFileAndClearData(existingData).then(() => {
  console.log("Data written and array cleared");
});

// Start the loop with the specified number of requests
start(REQUESTS);
// bulkDataDownload();
