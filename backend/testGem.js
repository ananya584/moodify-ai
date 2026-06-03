// backend/testGemini.js

require('dotenv').config()

const {
  analyzeMoodWithGemini,
} = require('./services/geminiService')

async function test() {
  const result =
    await analyzeMoodWithGemini(
      'bhai breakup ho gaya'
    )

  console.log(result)
}

test()