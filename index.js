const express = require('express');
const app = express();
app.use(express.json());

// Friendly HTML demo for GET /
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>BFHL API Demo</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f9f9f9; }
          pre { background: #222; color: #fff; padding: 16px; border-radius: 8px; }
          .container { max-width: 700px; margin: auto; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 2px 12px #0001; }
          h1 { color: #2d6cdf; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>BFHL API is Running 🚀</h1>
          <p>This is a demo REST API for the BFHL challenge. Use <b>POST /bfhl</b> with the following format:</p>
          <h3>Sample Request</h3>
          <pre>{
  "data": ["a", "1", "334", "4", "R", "$"]
}</pre>
          <h3>Sample Response</h3>
          <pre>{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}</pre>
          <p>Source code: <a href="https://github.com/Jeethshah/bfhl-api" target="_blank">GitHub Repo</a></p>
        </div>
      </body>
    </html>
  `);
});

// Change these values to your own details
const FULL_NAME = 'john_doe'; // lowercase, underscores
const DOB = '17091999'; // ddmmyyyy
const EMAIL = 'john@xyz.com';
const ROLL_NUMBER = 'ABCD123';

function isNumber(str) {
  return /^-?\d+$/.test(str);
}

function isAlphabet(str) {
  return /^[a-zA-Z]+$/.test(str);
}

function isSpecialChar(str) {
  return !isNumber(str) && !isAlphabet(str);
}

function toAlternatingCaps(str) {
  let res = '';
  let upper = true;
  for (let c of str) {
    if (/[a-zA-Z]/.test(c)) {
      res += upper ? c.toUpperCase() : c.toLowerCase();
      upper = !upper;
    }
  }
  return res;
}

app.post('/bfhl', (req, res) => {
  try {
    const data = req.body.data || [];
    let even_numbers = [], odd_numbers = [], alphabets = [], special_characters = [], sum = 0, alpha_concat = '';

    data.forEach(item => {
      if (isNumber(item)) {
        const num = parseInt(item, 10);
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
        sum += num;
      } else if (isAlphabet(item)) {
        alphabets.push(item.toUpperCase());
        alpha_concat += item;
      } else if (isSpecialChar(item)) {
        special_characters.push(item);
      }
    });

    // Prepare concat_string: all alpha chars in input, reversed, alternating caps
    let allAlphaChars = alpha_concat.split('').reverse().join('');
    let concat_string = toAlternatingCaps(allAlphaChars);

    res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: sum.toString(),
      concat_string
    });
  } catch (e) {
    res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB}`,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: ""
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});