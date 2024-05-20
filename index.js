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
    Authorization: "Basic d2ViX3YyOkVOanNuUE54NHhXeHVkODU=",
    "Cognito-Authorization":
      "eyJraWQiOiJ4RmIzSVZuTXhYZEhUaWNTN1NJeVNGc3BHOUsydVZ2NUVNT2U4NkQxeHhBPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoidlA2ZEd5d3RsUDNzZl8tdmtzZDhZQSIsInN1YiI6IjNmM2RkYzRjLTEzNWQtNDdjOC1iNmJmLTNjNGQwNmM1ZTc0OSIsImN1c3RvbTpwbHVnc2hhcmVfaWQiOiI1MDg1NDI1IiwiY29nbml0bzpncm91cHMiOlsidXMtZWFzdC0xX293ZVE3WG1HZl9Hb29nbGUiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX293ZVE3WG1HZiIsImNvZ25pdG86dXNlcm5hbWUiOiJnb29nbGVfMTE1NDE5NDgwNDkyMDczNDAyMDIwIiwiZ2l2ZW5fbmFtZSI6IkFCSEFZIiwicGljdHVyZSI6Imh0dHBzOlwvXC9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tXC9hXC9BQ2c4b2NJNFAta21lV1ctdXRtbURHdGlTNXhrLU1tSVlxSGJhdng3MjdHOHlBQmphcEtZaTlqZD1zOTYtYyIsImF1ZCI6IjJ1MHFpM3IwZWtjM2huc2wycnNnMzExY2kiLCJpZGVudGl0aWVzIjpbeyJ1c2VySWQiOiIxMTU0MTk0ODA0OTIwNzM0MDIwMjAiLCJwcm92aWRlck5hbWUiOiJHb29nbGUiLCJwcm92aWRlclR5cGUiOiJHb29nbGUiLCJpc3N1ZXIiOm51bGwsInByaW1hcnkiOiJ0cnVlIiwiZGF0ZUNyZWF0ZWQiOiIxNzEyOTE3OTE4Nzg5In1dLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTcxNTc2NDE4MCwibmFtZSI6IkFCSEFZIEtVTUFSIiwiZXhwIjoxNzE1NzY3ODE5LCJpYXQiOjE3MTU3NjQyMTksImVtYWlsIjoiYWtiazA0QGdtYWlsLmNvbSJ9.L9JMZ-oPZt1r0AqdqNnuMAtO_u40fS6fpVs5a3M1__Z_6_Ci1yVzUiTmvqquRKIi65LZkUk81AAo0MAWWWlzYKAz2xXafhRhZvrxn7E8yWGCOA4jyqCkkh0G4zrC74CEzr8b5XZr6GpDdfIa6wvfv6GpfRoZYLY4753jQO9qnPPVRnzed47ukJSWyDHJD9-fMkKZQJRvUpQQHvnNy_iq0NZgYB6qrH1g6a8UgU-_zx7Qmrge_URnin8rZO3whTW0KGrmFR0L0TxPKcV_i0Y06LiOkk6Z559CGBCOM8ZWLRZGYfVADD8ff-83Ue9tONAAZPquh7jET5PZMiplyT27Ng",

    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
  };

  try {
    const response = await axios.get(url, { params, headers });

    let existingData = [];
    try {
      const data = await fs.readFile("c.json", "utf-8");
      existingData = JSON.parse(data);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    existingData.push(...response.data);

    await fs.writeFile("c.json", JSON.stringify(existingData, null, 2));

    console.log(
      `Data saved for latitude: ${latitude}, longitude: ${longitude}`
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
const aaaa = [];
const run = async () => {
  try {
    const latitude = parseFloat(await fs.readFile("latitude.txt", "utf8"));
    let longitude = parseFloat(await fs.readFile("longitude.txt", "utf8"));

    await fetchData(latitude, longitude);

    longitude += 0.2121734619140625;
    await fs.writeFile("longitude.txt", longitude.toString());

    console.log(`Updated longitude: ${longitude}`);
  } catch (error) {
    console.error("Error in run function:", error);
    aaaa.push(longitude);
  }
};

const INTERVAL = 0;
const REQUESTS = 1696;

const start = async (requests) => {
  for (let i = 0; i < requests; i++) {
    await run();
    await new Promise((resolve) => setTimeout(resolve, INTERVAL));
  }
};

const bulkDataDownload = async () => {
  try {
    let currentCounter = await readCounter();
    const reqArr = [];
    for (let i = 0; i < 1696; i++) {
      reqArr.push(run());
      currentCounter += 0.2121734619140625;
    }
    await Promise.all(reqArr);
    await updateCounter(currentCounter);
    console.log("FETCHED NEXT 500 IN THE BULK DATA");
  } catch (error) {
    console.log("Error in bulkDataDownload:", error);
  }
};

// Start the loop with the specified number of requests
start(REQUESTS);
// bulkDataDownload();
