// backend/testSpotify.js

const axios = require("axios");

async function test() {
  try {
    const auth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(res.data);
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
}

require("dotenv").config();
test();